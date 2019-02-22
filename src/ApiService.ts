import { ApiResPage } from '@/models/api-response/Page';
import { CMSPage } from './models/CMSPage';
import rp from 'request-promise-native';
const API_URL = 'http://localhost:1337/';
const API_TOKEN = '0bda3db60d372e9c90ffdeddc4098c';



export default class ApiService {
    public static async getPage(slug: string): Promise<CMSPage | null> {

        let response = { total: 0, entries: [] };
        const rpOptions = {
            method: 'POST',
            uri: `${API_URL}api/collections/get/page`,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    slug
                },
                fields: {
                    toc: 1,
                    containers: 1
                },
                populate: 1
            })
        };

        try {
            response = JSON.parse(await rp(rpOptions));
        } catch (err) {
            throw err;
        }

        if (response.total === 0) throw new Error(`Page '${slug}' was not found`);

        const page = response.entries[0] as ApiResPage;
        page.containers = page.containers.map(c => {
            c.id = c._id;
            c.pinnedImage = this.normalizeImage(c.pinnedImage);
            c.headerImage = this.normalizeImage(c.headerImage);

            return c;
        });

        return page as CMSPage;
    }

    public static normalizeImage(response: any): string {
        if (Array.isArray(response)) return '';
        response = response as { path: string };

        let path = response.path;

        if (!path) return '';

        // if path starts with a '/' it is probably a relative path
        if (path.match(/^\/.*/i)) {
            path = `${API_URL}${path.substr(1)}`;
        }

        return path;
    }
}
