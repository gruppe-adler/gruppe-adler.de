import { BlogEntry } from './BlogEntry';
import { SSOUser } from './SSOUser';

export const BLOG_POST_TYPE = 'blogpost';

export interface BlogPostConstructorArgs {
    id: string;
    heading: string;
    content: string;
    pinnedImage: string;
    tags: string[];
    author: SSOUser;
    date: Date;
    published: boolean;
}

export class BlogPost implements BlogEntry {
    public type: string = BLOG_POST_TYPE;
    public date: Date;
    public id: string;

    public heading?: string;
    public content: string;
    public pinnedImage?: string;
    public published: boolean;
    public tags: string[];
    public author: SSOUser;

    constructor({ id, heading, content, pinnedImage, tags, author, date, published }: BlogPostConstructorArgs) {
        this.id = id;
        this.heading = heading;
        this.content = content;
        this.pinnedImage = pinnedImage;
        this.tags = tags;
        this.author = author;
        this.date = date;
        this.published = published;
    }
}
