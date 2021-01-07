import * as fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { Page } from '../models';

let cachedSitemap: Buffer|null = null;

const BUILD_TIME_PATH = '/build-date.txt';
let buildTime = new Date(0);
if (fs.existsSync(BUILD_TIME_PATH)) {
    const str = fs.readFileSync(BUILD_TIME_PATH, 'utf-8');
    const seconds = Number.parseInt(str, 10);

    if (!Number.isNaN(seconds)) {
        buildTime = new Date(seconds * 1000);
    }
}

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
    const pages: Page[] = await Page.findAll();
    for (const { slug, priority, updatedAt } of pages) {
        const lastMod = buildTime.getTime() > updatedAt.getTime() ? buildTime : updatedAt;

        smStream.write({ url: slug, priority, lastmod: lastMod.toISOString() });
    }

    // add home page
    smStream.write({ url: '/', priority: 1, changefreq: 'weekly' });

    const prom = streamToPromise(pipeline);
    smStream.end();
    return prom;
}

export async function getSitemap(): Promise<Buffer> {
    await initialCachePromise;
    return cachedSitemap;
}
