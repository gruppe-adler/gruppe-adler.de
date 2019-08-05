export default interface User {
    id: number;
    username: string;
    steamId: string;
    avatar: string;
    admin: boolean;
    groups: UserGroup[];
    primaryGroup: UserGroup;
}

interface UserGroup {
    id: number;
    tag: string;
    color: string;
    label: string;
    hidden: boolean;
}
