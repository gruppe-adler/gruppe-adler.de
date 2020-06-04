import { fetchJSON } from './utils';
import ResponseError from './utils/ResponseError';

export interface Container {
    id: number;
    heading: string;
    content: string;
    footer: string;
    headerColor: string|null;
    headerImage: string|null;
    pinnedImage: string|null;
    index: number;
    new?: true;
    pageSlug: string;
}

export interface Page {
    slug: string;
    toc: boolean;
    containers: Container[];
}

const CMS_URI = window.location.origin;

const CMS_URL = `${CMS_URI}/api/v1`;

const dataUrlRegex = /^data:(.+\/.+);base64,/i;

export async function uploadImage (dataUrl: string): Promise<string> {
    const matches = dataUrl.match(dataUrlRegex);

    if (matches == null) throw new Error('Oopps'); // TODO

    const [header, mimeType] = matches;
    const base64Str = dataUrl.substr(header.length);

    const byteChars = window.atob(base64Str);
    const array = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        array[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(array);
    const blob = new Blob([byteArray], { type: mimeType });

    const { fileName } = await fetchJSON<{ fileName: string }>(`${CMS_URL}/upload`, { method: 'POST', headers: { 'Content-Type': mimeType }, body: blob });
    return `${CMS_URI}/uploads/${fileName}`;
}

export async function loadPage (path: string): Promise<Page> {
    const page = await fetchJSON<Page>(`${CMS_URL}/page${path}`);

    page.containers = page.containers.sort((a, b) => a.index - b.index);

    return page;
}

export async function createPage (p: Page): Promise<Page> {
    const page = await fetchJSON<Page>(`${CMS_URL}/page`, { method: 'POST', body: JSON.stringify(p), headers: { 'Content-Type': 'application/json' } });

    return page;
}

export async function createContainer (c: Container): Promise<Container> {
    const promises: Promise<void>[] = [];
    if (c.pinnedImage !== null) {
        promises.push(uploadImage(c.pinnedImage).then(url => { c.pinnedImage = url; }));
    }
    if (c.headerImage !== null) {
        promises.push(uploadImage(c.headerImage).then(url => { c.headerImage = url; }));
    }
    await Promise.all(promises);

    delete c.id;

    const newContainer = await fetchJSON<Container>(`${CMS_URL}/container`, { method: 'POST', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return newContainer;
}

export async function updateContainer (c: Partial<Container> & Pick<Container, 'id'>): Promise<Container> {
    const promises: Promise<void>[] = [];
    if (c.pinnedImage !== undefined && c.pinnedImage !== null) {
        promises.push(uploadImage(c.pinnedImage).then(url => { c.pinnedImage = url; }));
    }
    if (c.headerImage !== undefined && c.headerImage !== null) {
        promises.push(uploadImage(c.headerImage).then(url => { c.headerImage = url; }));
    }
    await Promise.all(promises);

    const updatedContainer = await fetchJSON<Container>(`${CMS_URL}/container/${c.id}`, { method: 'PUT', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return updatedContainer;
}

export async function deleteContainer (id: number): Promise<void> {
    const response = await fetch(`${CMS_URL}/container/${id}`, { method: 'DELETE', credentials: 'include' });

    if (!response.ok) throw new ResponseError(response);
}
