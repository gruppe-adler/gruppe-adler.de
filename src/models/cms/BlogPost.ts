export interface CmsBlogPost {
    author: number;
    heading: string;
    content: string;
    pinnedImage: any;
    date: string;
    data: any | string;
    type: CmsBlogPostType;
    published: boolean;
    tags: any[];
    _id: string;
}

export enum CmsBlogPostType {
    blogpost = 'blogpost',
    modset = 'modset',
    event = 'event'
}
