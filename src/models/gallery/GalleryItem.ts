export interface GalleryItem {
    _id: string;
    type: string;
    size: 1|2|3;
    position: number;
    title?: string;
    author?: string;
}
