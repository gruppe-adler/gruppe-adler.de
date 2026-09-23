import { API_URL } from '.';
import { fetchJSON } from './utils';
import ResponseError from './utils/ResponseError';

export interface AuthUser {
    sub: string;
    name?: string;
    picture?: string;
    roles: string[];
}

export async function authenticate (): Promise<AuthUser|null> {
    try {
        const res = await fetchJSON(`${API_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include'
        }) as {
            authenticated: boolean;
            user?: AuthUser;
        };

        if (!res.authenticated || !res.user) {
            return null;
        }

        return res.user;
    } catch (error) {
        if (ResponseError.is(error) && error.response.status === 401) {
            return null;
        }

        throw error;
    }
}

export function login (): void {
    const url = new URL(`${API_URL}/auth/login`, window.location.origin);

    url.searchParams.set(
        'returnTo',
        `${window.location.pathname}${window.location.search}${window.location.hash}`
    );

    window.location.assign(url.href);
}

export function logout (): void {
    window.location.assign(`${API_URL}/auth/logout`);
}
