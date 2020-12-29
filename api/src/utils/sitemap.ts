import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { Page } from '../models';

let cachedSitemap: Buffer|null = null;

const initialCachePromise = cacheSitemap();

Page.addHook('afterCreate', cacheSitemap);
Page.addHook('afterDestroy', cacheSitemap);
Page.addHook('afterUpdate', cacheSitemap);

async function cacheSitemap(): Promise<void> {
    cachedSitemap = await generateSitemap();
}

async function generateSitemap(): Promise<Buffer> {
    const smStream = new SitemapStream({ hostname: 'https://gruppe-adler.de/' });
    const pipeline = smStream.pipe(createGzip());

    // add CMS pages
    const pages = await Page.findAll();
    for (const { slug, priority, updatedAt } of pages) {
        smStream.write({ url: slug, priority, lastmod: updatedAt.toISOString() });
    }

    // add home page
    smStream.write({ url: '/', priority: 0.5, changefreq: 'weekly' });

    const prom = streamToPromise(pipeline);
    smStream.end();
    return prom;
}

export async function getSitemap(): Promise<Buffer> {
    await initialCachePromise;
    return cachedSitemap;
}
