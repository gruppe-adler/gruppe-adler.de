export interface CmsGalleryItem {
    type: 'image'|'video';
    size: '1'|'2'|'3';
    position: string;
    image?: unknown;
    videoUrl?: string;
    title?: string;
    author?: string;
    _id: string;
}
