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

const CMS_URL = `${window.location.origin}/api/v1`;

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
    // TODO: Handle new images

    delete c.id;

    const newContainer = await fetchJSON<Container>(`${CMS_URL}/container`, { method: 'POST', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return newContainer;
}

export async function updateContainer (c: Partial<Container> & Pick<Container, 'id'>): Promise<Container> {
    // TODO: Handle new images

    const updateContainer = await fetchJSON<Container>(`${CMS_URL}/container/${c.id}`, { method: 'PUT', body: JSON.stringify(c), headers: { 'Content-Type': 'application/json' } });

    return updateContainer;
}

export async function deleteContainer (id: number): Promise<void> {
    const response = await fetch(`${CMS_URL}/container/${id}`, { method: 'DELETE', credentials: 'include' });

    if (!response.ok) throw new ResponseError(response);
}
