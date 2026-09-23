import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Config {
    keycloak: {
        issuer: string
        clientId: string
        clientSecret: string
        requiredRole: string
    }
    publicUrl: string
}

export const config = JSON.parse(
    readFileSync(
        fileURLToPath(new URL('../config/config.json', import.meta.url)),
        { encoding: 'utf-8' }
    )
) as Config;
