import { fetchJSON } from './utils';

const SSO_URL = 'https://sso.gruppe-adler.de';

interface UserGroup {
    id: number;
    tag: string;
    color: string;
    label: string;
    hidden: boolean;
}

export interface SSOUser {
    id: number;
    username: string;
    steamId: string;
    avatar: string;
    admin: boolean;
    groups: UserGroup[];
    primaryGroup: UserGroup;
}

export async function authenticate (): Promise<SSOUser|null> {
    const res = await fetchJSON(`${SSO_URL}/api/v1/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            mutation {
                authenticate {
                    id
                    username
                    steamId
                    avatar
                    admin
                    groups { ...fullGroup }
                    primaryGroup { ...fullGroup }
                }
            }
            fragment fullGroup on Group {
                id
                tag
                color
                label
                hidden
            }
            `,
            variables: {}
        })
    }) as { data: { authenticate: SSOUser|null } };

    return res.data.authenticate;
}
