import 'express-session';

declare module 'express-session' {
    interface SessionData {
        oidcState?: string
        oidcNonce?: string
        oidcCodeVerifier?: string

        returnTo?: string

        user?: {
            sub: string
            name?: string
            picture?: string
            roles: string[]
        }
    }
}
