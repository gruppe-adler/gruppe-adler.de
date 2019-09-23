import { BlogPost, BlogPostConstructorArgs } from './BlogPost';

export const EVENT_REPORT_TYPE = 'event';

export interface BlogPostEventConstructorArgs extends BlogPostConstructorArgs {
    participants: number;
    externalParticipants: number;
    images: BlogPostEventMedia[];
    videos: BlogPostEventMedia[];
}

export class BlogPostEvent extends BlogPost {
    public type: string = EVENT_REPORT_TYPE;
    public participants: number;
    public externalParticipants: number;
    public images: BlogPostEventMedia[];
    public videos: BlogPostEventMedia[];

    constructor({
        id,
        heading,
        content,
        pinnedImage,
        tags,
        author,
        date,
        participants,
        externalParticipants,
        images,
        videos,
        published
    }: BlogPostEventConstructorArgs) {
        super({ id, heading, content, pinnedImage, tags, author, date, published });
        this.images = images;
        this.videos = videos;
        this.participants = participants;
        this.externalParticipants = externalParticipants;
    }
}

export interface BlogPostEventMedia {
    url: string;
    label: string;
}
