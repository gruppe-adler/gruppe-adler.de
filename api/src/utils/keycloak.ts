import { type Configuration, discovery } from 'openid-client';
import { config } from './config.js';

// Private on purpose: only loadKeycloakConfig may touch the cache.
let keycloakConfigPromise: Promise<Configuration> | null = null;

/**
 * Lazily runs OIDC discovery. Concurrent callers share one in-flight request,
 * and a failed attempt is not cached, so the next call retries.
 */
export async function loadKeycloakConfig (): Promise<Configuration> {
    if (keycloakConfigPromise === null) {
        const promise = discovery(
            new URL(config.keycloak.issuer),
            config.keycloak.clientId,
            config.keycloak.clientSecret
        ).catch((error: unknown) => {
            if (keycloakConfigPromise === promise) {
                keycloakConfigPromise = null;
            }
            throw error;
        });

        keycloakConfigPromise = promise;
    }

    return await keycloakConfigPromise;
}
