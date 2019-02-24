import { BlogEntry } from './Blogentry';
import { ForumUser } from './ForumUser';

export const BLOG_POST_TYPE = 'BlogPost';

export class BlogPost implements BlogEntry {
    public type: string = BLOG_POST_TYPE;
    public date: Date;

    public id: string;
    public heading?: string;
    public content: string;
    public pinnedImage?: string;
    public published: boolean;
    public tags: string[];
    public author: ForumUser;

    constructor({ id, heading, content, pinnedImage, tags, author, date, published }: {
        id: string,
        heading: string,
        content: string,
        pinnedImage: string,
        tags: string[],
        author: ForumUser,
        date: Date,
        published: boolean
    }) {
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