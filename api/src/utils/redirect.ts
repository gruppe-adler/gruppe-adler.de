import { config } from './config.js';

const publicOrigin = new URL(config.publicUrl).origin;
const fallback = new URL('/', publicOrigin).href;

/**
 * Returns an absolute URL on our own origin, or the site root if the input
 * is missing, malformed, or points anywhere else.
 */
export function getSafeReturnTo (value: unknown): string {
    if (typeof value !== 'string') return fallback;

    try {
        const url = new URL(value, publicOrigin);

        return url.origin === publicOrigin ? url.href : fallback;
    } catch {
        return fallback;
    }
}
