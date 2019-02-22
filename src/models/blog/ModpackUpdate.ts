import { BlogPost } from './BlogPost';
import { ForumUser } from './ForumUser';

export const MOD_PACK_UPDATE_TYPE = 'ModPackUpdate';

export class ModPackUpdate extends BlogPost {
    public type: string = MOD_PACK_UPDATE_TYPE;
    public changes: ModChange[];

    constructor({ id, heading, content, pinnedImage, tags, author, date, published, changes }: {
        id: string,
        heading: string,
        content: string,
        pinnedImage: string,
        tags: string[],
        author: ForumUser,
        date: Date,
        changes: ModChange[],
        published: boolean
    }) {
        super({ id, heading, content, pinnedImage, tags, author, date, published });
        this.changes = changes;
    }
}

export enum ModChangeTypes {
    'added',
    'updated',
    'removed'
}

export interface ModChange {
    type: ModChangeTypes;
    name: string;
    size: string;
}
