import { fetchJSON } from './utils';
import ResponseError from './utils/ResponseError';
import { API_URI, API_URL } from '.';

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
    title: string;
    description: string;
}

export async function uploadImage (dataUrl: string): Promise<string> {
    const base64Index = dataUrl.indexOf('base64,');
    const base64Str = dataUrl.substr(base64Index + 7);
    const mimeType = dataUrl.substring(5, base64Index - 1);

    const byteChars = window.atob(base64Str);
    const array = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        array[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(array);
    const blob = new Blob([byteArray], { type: mimeType });

    const { fileName } = await fetchJSON<{ fileName: string }>(`${API_URL}/upload`, { method: 'POST', headers: { 'Content-Type': mimeType }, body: blob });
    return `${API_URI}/uploads/${fileName}`;
}

export async function loadPage (path: string): Promise<Page> {
    const page = await fetchJSON<Page>(`${API_URL}/page${path}`);

    page.containers = page.containers.sort((a, b) => a.index - b.index);

    return page;
}

export async function createPage (p: Page): Promise<Page> {
    const page = await fetchJSON<Page>(`${API_URL}/page`, { method: 'POST', body: JSON.stringify(p), headers: { 'Content-Type': 'application/json' } });

    return page;
}

export async function createContainer (c: Container): Promise<Container> {
    const promises: Promise<void>[] = [];
    if (c.pinnedImage !== undefined && c.pinnedImage !== null) {
        promises.push(uploadImage(c.pinnedImage).then(url => { c.pinnedImage = url; }));
    }
    if (c.headerImage !== undefined && c.headerImage !== null) {
        promises.push(uploadImage(c.headerImage).then(url => { c.headerImage = url; }));
    }
    await Promise.all(promises);

    delete c.id;

    const newContainer = await fetchJSON<Container>(`${API_URL}/container`, { method: 'POST', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return newContainer;
}

export async function updateContainer (c: Partial<Container> & Pick<Container, 'id'>): Promise<Container> {
    const promises: Promise<void>[] = [];
    if (c.pinnedImage !== undefined && c.pinnedImage !== undefined && c.pinnedImage !== null) {
        promises.push(uploadImage(c.pinnedImage).then(url => { c.pinnedImage = url; }));
    }
    if (c.headerImage !== undefined && c.headerImage !== undefined && c.headerImage !== null) {
        promises.push(uploadImage(c.headerImage).then(url => { c.headerImage = url; }));
    }
    await Promise.all(promises);

    const updatedContainer = await fetchJSON<Container>(`${API_URL}/container/${c.id}`, { method: 'PUT', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return updatedContainer;
}

export async function updatePage (p: Partial<Page> & Pick<Page, 'slug'>): Promise<Page> {
    const { slug, ...data } = p;

    const page = await fetchJSON<Page>(`${API_URL}/page${slug}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });

    return page;
}

export async function deleteContainer (id: number): Promise<void> {
    const response = await fetch(`${API_URL}/container/${id}`, { method: 'DELETE', credentials: 'include' });

    if (!response.ok) throw new ResponseError(response);
}
