import { promisify } from 'node:util';
import { type NextFunction, type Request, type Response, Router } from 'express';
import {
    randomState,
    randomNonce,
    randomPKCECodeVerifier,
    calculatePKCECodeChallenge,
    buildAuthorizationUrl,
    authorizationCodeGrant
} from 'openid-client';
import { wrapAsync } from '../../utils/express.js';
import { config } from '../../utils/config.js';
import { loadKeycloakConfig } from '../../utils/keycloak.js';
import { getSafeReturnTo } from '../../utils/redirect.js';

const { clientId, requiredRole } = config.keycloak;
const redirectUri = `${config.publicUrl}/api/v1/auth/callback`;
const postLogoutRedirectUri = config.publicUrl;

export function requireAuth (
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.session.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    next();
}

const authRouter = Router();

authRouter.get('/login', wrapAsync(async (req, res) => {
    req.session.returnTo = getSafeReturnTo(req.query.returnTo);

    const oidcConfig = await loadKeycloakConfig();

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
}));

authRouter.get('/callback', wrapAsync(async (req, res) => {
    const { oidcState, oidcNonce, oidcCodeVerifier } = req.session;

    if (!oidcState || !oidcNonce || !oidcCodeVerifier) {
        res.status(400).json({ error: 'Missing OIDC session state' });
        return;
    }

    const oidcConfig = await loadKeycloakConfig();

    const currentUrl = new URL(
        `${redirectUri}?${new URLSearchParams(
            req.query as Record<string, string>
        ).toString()}`
    );

    const tokens = await authorizationCodeGrant(oidcConfig, currentUrl, {
        expectedState: oidcState,
        expectedNonce: oidcNonce,
        pkceCodeVerifier: oidcCodeVerifier
    });

    // one-time values: clear them no matter how the rest of the handler ends
    delete req.session.oidcState;
    delete req.session.oidcNonce;
    delete req.session.oidcCodeVerifier;

    const claims = tokens.claims();

    if (!claims?.sub) {
        res.status(401).json({ error: 'Missing subject claim' });
        return;
    }

    const realmAccess = claims.realm_access as { roles?: string[] } | undefined;
    const resourceAccess = claims.resource_access as
        | Record<string, { roles?: string[] }>
        | undefined;

    const roles = [
        ...new Set([
            ...(realmAccess?.roles ?? []),
            ...(resourceAccess?.[clientId]?.roles ?? [])
        ])
    ];

    if (!roles.includes(requiredRole)) {
        res.status(403).json({ error: 'Required role missing' });
        return;
    }

    req.session.user = {
        sub: claims.sub,
        name:
            typeof claims.name === 'string'
                ? claims.name
                : typeof claims.preferred_username === 'string'
                    ? claims.preferred_username
                    : undefined,
        picture: typeof claims.picture === 'string' ? claims.picture : undefined,
        roles
    };

    const returnTo = req.session.returnTo ?? '/';
    delete req.session.returnTo;

    res.redirect(returnTo);
}));

authRouter.get('/me', (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ authenticated: false });
        return;
    }

    res.json({ authenticated: true, user: req.session.user });
});

authRouter.get('/logout', wrapAsync(async (req, res) => {
    await promisify(req.session.destroy.bind(req.session))();

    res.redirect(postLogoutRedirectUri);
}));

export default authRouter;
