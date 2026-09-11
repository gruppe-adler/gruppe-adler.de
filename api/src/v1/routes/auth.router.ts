import { type NextFunction, type Request, type Response, Router } from 'express';
import {
    discovery,
    randomState,
    randomNonce,
    randomPKCECodeVerifier,
    calculatePKCECodeChallenge,
    buildAuthorizationUrl,
    authorizationCodeGrant,
    buildEndSessionUrl
} from 'openid-client';
import { wrapAsync } from '../../utils/express.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

interface Config {
    keycloak: {
        issuer: string
        clientId: string
        clientSecret: string
        requiredRole: string
    }
    publicUrl: string
}

const config = JSON.parse(
    readFileSync(
        fileURLToPath(
            new URL('../../config/config.json', import.meta.url)
        ),
        { encoding: 'utf-8' }
    )
) as Config;

const keycloakIssuer = new URL(config.keycloak.issuer);

const clientId = config.keycloak.clientId;

const clientSecret = config.keycloak.clientSecret;

const requiredRole = config.keycloak.requiredRole;

const redirectUri = `${config.publicUrl}/api/v1/auth/callback`;

const postLogoutRedirectUri = config.publicUrl;

const keycloakConfigPromise = discovery(
    keycloakIssuer,
    clientId,
    clientSecret
);

export function requireAuth (
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.session.user) {
        res.status(401).json({
            error: 'Not authenticated'
        });
        return;
    }

    next();
}

export function requireRole (role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user;

        if (!user) {
            res.status(401).json({
                error: 'Not authenticated'
            });
            return;
        }

        if (!user.roles.includes(role)) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return;
        }

        next();
    };
}

const authRouter = Router();

authRouter.get('/login', wrapAsync(async (req, res, next) => {
    try {
        const returnTo =
            typeof req.query.returnTo === 'string' &&
            req.query.returnTo.startsWith('/')
                ? req.query.returnTo
                : '/';

        req.session.returnTo = returnTo;

        const oidcConfig = await keycloakConfigPromise;

        const state = randomState();
        const nonce = randomNonce();
        const codeVerifier = randomPKCECodeVerifier();

        const codeChallenge = await calculatePKCECodeChallenge(
            codeVerifier
        );

        req.session.oidcState = state;
        req.session.oidcNonce = nonce;
        req.session.oidcCodeVerifier = codeVerifier;

        const authorizationUrl = buildAuthorizationUrl(oidcConfig, {
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid profile email',
            state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        res.redirect(authorizationUrl.href);
    } catch (error) {
        next(error);
    }
}));

authRouter.get('/callback', (req, res, next) => {
    void (async () => {
        try {
            if (!req.session.oidcState ||
                !req.session.oidcNonce ||
                !req.session.oidcCodeVerifier) {
                res.status(400).json({
                    error: 'Missing OIDC session state'
                });
                return;
            }

            const oidcConfig = await keycloakConfigPromise;

            const currentUrl = new URL(
                `${redirectUri}?${new URLSearchParams(
                    req.query as Record<string, string>
                ).toString()}`
            );

            const tokens = await authorizationCodeGrant(
                oidcConfig,
                currentUrl,
                {
                    expectedState: req.session.oidcState,
                    expectedNonce: req.session.oidcNonce,
                    pkceCodeVerifier: req.session.oidcCodeVerifier
                }
            );

            const claims = tokens.claims();

            if (!claims?.sub) {
                res.status(401).json({
                    error: 'Missing subject claim'
                });
                return;
            }

            const realmAccess = claims.realm_access as
                | { roles?: string[] }
                | undefined;

            const resourceAccess = claims.resource_access as
                | Record<string, { roles?: string[] }>
                | undefined;

            const realmRoles = realmAccess?.roles ?? [];

            const clientRoles = resourceAccess?.[clientId]?.roles ?? [];

            const roles = [
                ...new Set([
                    ...realmRoles,
                    ...clientRoles
                ])
            ];

            if (!roles.includes(requiredRole)) {
                delete req.session.oidcState;
                delete req.session.oidcNonce;
                delete req.session.oidcCodeVerifier;

                res.status(403).json({
                    error: 'Required role missing'
                });
                return;
            }

            req.session.idToken = tokens.id_token;
            req.session.accessToken = tokens.access_token;

            req.session.user = {
                sub: claims.sub,
                name:
                    typeof claims.name === 'string'
                        ? claims.name
                        : typeof claims.preferred_username === 'string'
                            ? claims.preferred_username
                            : undefined,
                picture:
                    typeof claims.picture === 'string'
                        ? claims.picture
                        : undefined,
                roles
            };

            delete req.session.oidcState;
            delete req.session.oidcNonce;
            delete req.session.oidcCodeVerifier;

            const returnTo = req.session.returnTo ?? '/';

            delete req.session.returnTo;

            res.redirect(returnTo);
        } catch (error) {
            next(error);
        }
    })();
});

authRouter.get('/me', (req, res) => {
    if (!req.session.user) {
        res.status(401).json({
            authenticated: false
        });
        return;
    }

    res.json({
        authenticated: true,
        user: req.session.user
    });
});

authRouter.get('/logout', wrapAsync(async (req, res) => {
    const oidcConfig = await keycloakConfigPromise;

    const logoutUrl = buildEndSessionUrl(oidcConfig, {
        post_logout_redirect_uri: postLogoutRedirectUri,
        ...(req.session.idToken
            ? {
                id_token_hint: req.session.idToken
            }
            : {})
    });

    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({
                error: 'Failed to destroy session'
            });
            return;
        }

        res.redirect(logoutUrl.href);
    });
}));

export default authRouter;
