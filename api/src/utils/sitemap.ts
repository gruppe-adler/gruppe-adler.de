import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { Page } from '../models';

let cachedSitemap: Buffer|null = null;
let cachedSitemapTimestamp: number = 0;

const generateSitemap = async (): Promise<Buffer> => {
    const smStream = new SitemapStream({ hostname: 'https://dev.gruppe-adler.de/' })
    const pipeline = smStream.pipe(createGzip())
 
    const pages = await Page.findAll();

    for (const { slug } of pages) {
        smStream.write({ url: slug });
    }

    const prom = streamToPromise(pipeline);
    smStream.end()
    return prom;
}

export const getSitemap = async (): Promise<Buffer> => {
    if (cachedSitemap === null) {
        const sitemap = await generateSitemap();
        cachedSitemap = sitemap;
        cachedSitemapTimestamp = (new Date()).valueOf();
    }

    // generate new sitemap if last generation is longer than an hour ago
    if ((new Date()).valueOf() - cachedSitemapTimestamp < 216000000) { // 1 hour
        const sitemap = await generateSitemap();
        cachedSitemap = sitemap;
        cachedSitemapTimestamp = (new Date()).valueOf();
    }

    return cachedSitemap;
}