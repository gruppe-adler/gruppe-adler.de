import { type Request, type Response, type NextFunction } from 'express/index';

import fetch from 'node-fetch';
import { globalErrorHandler } from './express';
import ResponseError from './ResponseError';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config/config.json');

interface SSOUser {
    admin: boolean
    groups: Array<{ tag: string }>
}

async function fetchUser (token: string): Promise<SSOUser | null> {
    const res = await fetch(`${config.sso.domain}/api/v1/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
            mutation {
                authenticate {
                    admin
                    groups { ...fullGroup }
                }
            }
            fragment fullGroup on Group {
                tag
            }
            `,
            variables: {}
        })
    });

    if (!res.ok) throw new ResponseError(401);

    const json = await res.json() as { data: { authenticate: SSOUser | null } };

    return json.data.authenticate;
}

async function validateToken (token: string): Promise<void> {
    const user = await fetchUser(token);

    if (user === null) throw new ResponseError(401);

    const groups = user.groups.map(g => g.tag);
    const admin = user.admin;
    let isInGroup = false;

    for (const grp of ['adler', 'fuehrung']) {
        if (groups.includes(grp)) isInGroup = true;
    }

    if (!admin && !isInGroup) throw new ResponseError(403);
}

function extractToken (req: Request): string {
    if (req.cookies[config.sso.cookiename]) {
        return req.cookies[config.sso.cookiename];
    }

    if (req.headers.authorization) {
        const header = req.headers.authorization;
        if (header.match(/^bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i)) {
            return header.replace(/^Bearer\s+/i, '');
        }
    }

    throw new Error('Couldn\'t find token to extract');
}

export async function ssoCheckAuthorized (req: Request, res: Response, next: NextFunction): Promise<void> {
    let token: string;
    try {
        token = extractToken(req);
    } catch (err) {
        res.status(401).end();
        return;
    }

    try {
        await validateToken(token);
    } catch (err) {
        globalErrorHandler(err, req, res, next);
        return;
    }

    next();
}
