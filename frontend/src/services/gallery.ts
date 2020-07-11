export interface GalleryItem {
    id: number;
    type: string;
    size: 1|2|3;
    index: number;
    title?: string;
    author?: string;
}

export interface GalleryImage extends GalleryItem {
    type: 'image';
    image: string;
}

export interface GalleryVideo extends GalleryItem {
    type: 'video';
    videoUrl: string;
    metaData?: {
        img: {
            url: string;
            width: number;
            height: number;
        };
        video: {
            width: number;
            height: number;
            url: string;
        };
    };
}

export async function fetchGalleryItems (): Promise<GalleryItem[]> {
    const img: GalleryImage = {
        id: 0,
        type: 'image',
        size: 2,
        index: 0,
        title: 'Rick',
        author: 'DerZade',
        image: 'https://dazedimg-dazedgroup.netdna-ssl.com/830/azure/dazed-prod/1150/0/1150228.jpg'
    };

    const img2: GalleryImage = {
        id: 1,
        type: 'image',
        size: 2,
        index: 1,
        title: 'Cuter Bär',
        author: 'DerZade',
        image: 'https://i.ibb.co/gv19VDX/lK0vvgS.jpg'
    };

    const vid: GalleryVideo = {
        id: 2,
        type: 'video',
        size: 1,
        index: 2,
        title: 'Weapon Safety (@safety)',
        author: 'XiviD',
        videoUrl: 'hndMfCER0hg'
    };

    return [vid, img, img2];
}
