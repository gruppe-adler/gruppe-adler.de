import { BlogPost, BlogPostConstructorArgs } from './BlogPost';

export const MOD_UPDATE_TYPE = 'modset';

export interface BlogPostModsetConstructorArgs extends BlogPostConstructorArgs {
    changes: BlogPostModsetChange[];
    hint: string;
}

export class BlogPostModset extends BlogPost {
    public type: string = MOD_UPDATE_TYPE;
    public changes: BlogPostModsetChange[];
    public hint: string;

    constructor({
        id,
        heading,
        content,
        pinnedImage,
        tags,
        author,
        date,
        published,
        changes,
        hint
    }: BlogPostModsetConstructorArgs) {
        super({ id, heading, content, pinnedImage, tags, author, date, published });
        this.changes = changes;
        this.hint = hint;
    }
}

export enum BlogPostModsetChangeType {
    added = 'added',
    updated = 'updated',
    removed = 'removed'
}

export interface BlogPostModsetChange {
    type: BlogPostModsetChangeType;
    name: string;
    size: string;
}
