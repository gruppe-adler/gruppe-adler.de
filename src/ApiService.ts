import { Container } from '@/models/Container';
import DirectusSDK from '@directus/sdk-js';
import { CMSPage } from './models/CMSPage';
const API_URL = 'http://localhost:7000/';
const PROJECT = '_';
const directusClient = new DirectusSDK({
  url: API_URL,
  project: PROJECT
});



export default class ApiService {
    public static async getPage(slug: string): Promise<CMSPage | null> {

        let data;
        try {
            const response = await directusClient.getItems('page', {
                single: true,
                filter: {
                    slug: {
                        eq: slug
                    }
                },
                fields: '*, containers.*, containers.pinned_image.data.full_url, containers.header_image.data.full_url'
            });

            data = response.data;
        } catch (err) {
            throw err;
        }

        const page: CMSPage = {
            toc: data.toc,
            containers: data.containers ? data.containers.map(this.normalizeContainer) : [],
            left: data.left ? this.normalizeLeftRight(data.left) : undefined,
            right: data.right ? this.normalizeLeftRight(data.right) : undefined
        };

        return page;
    }

    private static normalizeContainer(data: {
                                                heading: string,
                                                content: string,
                                                footer: string,
                                                header_color: string,
                                                header_image: { data: { full_url: string } },
                                                pinned_image: { data: { full_url: string } }
                                            }): Container {

        return {
            heading: data.heading ? data.heading : undefined,
            content: data.content ? data.content : '',
            footer: data.footer ? data.footer : undefined,
            headerColor: data.header_color ? data.header_color : undefined,
            headerImage: data.header_image ? data.header_image.data.full_url : undefined,
            pinnedImage: data.pinned_image ? data.pinned_image.data.full_url : undefined
        };
    }

    private static normalizeLeftRight(data: {content: string}): string {
        return data.content;
    }
}
