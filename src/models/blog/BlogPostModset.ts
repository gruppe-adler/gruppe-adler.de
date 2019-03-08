import { BlogPost, BlogPostConstructorArgs } from './BlogPost';
import { ForumUser } from './ForumUser';

export const MOD_UPDATE_TYPE = 'modset';

export interface BlogPostModsetConstructorArgs extends BlogPostConstructorArgs {
    changes: BlogPostModsetChange[];
}

export class BlogPostModset extends BlogPost {
    public type: string = MOD_UPDATE_TYPE;
    public changes: BlogPostModsetChange[];

    constructor({id,
        heading,
        content,
        pinnedImage,
        tags,
        author,
        date,
        published,
        changes
    }: BlogPostModsetConstructorArgs) {
        super({ id, heading, content, pinnedImage, tags, author, date, published });
        this.changes = changes;
    }
}

export enum BlogPostModsetChangeType {
    'added',
    'updated',
    'removed'
}

export interface BlogPostModsetChange {
    type: BlogPostModsetChangeType;
    name: string;
    size: string;
}
