import { GalleryItem } from './GalleryItem';

export interface GalleryVideo extends GalleryItem {
    type: 'video';
    videoUrl: string;
}
