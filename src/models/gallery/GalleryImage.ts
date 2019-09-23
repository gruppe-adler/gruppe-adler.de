import { GalleryItem } from './GalleryItem';

export interface GalleryImage extends GalleryItem {
    type: 'image';
    image: string;
}
