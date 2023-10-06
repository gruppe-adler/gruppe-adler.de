import { join } from 'path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'fs';

// eslint-disable-next-line import/no-duplicates
import express from 'express';
// eslint-disable-next-line import/no-duplicates
import { type Request, type Response, type NextFunction } from 'express';

import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import v1Router from './v1/index.js';

import './database.js';
import { getSitemap } from './utils/sitemap.js';
import { wrapAsync } from './utils/express.js';
import { Page } from './models/index.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();

// cors
app.use(cors({
    credentials: true,
    origin: [
        /gruppe-adler.de$/i,
        /localhost:[0-9]+$/i,
        /127.0.0.1:[0-9]+$/i,
        /127.0.0.1$/i,
        /localhost$/i
    ]
}));

// body parser
app.use(bodyParser.json());

app.use(cookieParser());

// logger
app.use(morgan('short'));

// gzip
app.use(compression());

// api
app.use('/api/v1', v1Router);

app.use('/uploads', express.static(join(__dirname, '../data/uploads')));

app.get('/sitemap.xml', wrapAsync(async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    try {
        const sitemap = await getSitemap();
        res.send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}));

// frontend
if (existsSync(join(__dirname, '../frontend'))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const assetsManifest: Record<string, string> = JSON.parse(readFileSync(join(__dirname, '../frontend', 'assets-manifest.json'), { encoding: 'utf-8' }));

    const cacheHeaders: Record<string, string | undefined> = {};

    for (const originalFilePath in assetsManifest) {
        if (Object.prototype.hasOwnProperty.call(assetsManifest, originalFilePath)) {
            const outputFilePath = assetsManifest[originalFilePath];
            // we do not cache html files
            if (!/.+\.(?!html).*$/i.test(outputFilePath)) continue;

            // if the outputFilePath is not equal to the originalFilePath we consider the file as hashed so we can cache it indefinitely (= 1 year)
            const cacheControl = outputFilePath === originalFilePath ? 'public, max-age=2678400' : 'public, max-age=31536000';

            cacheHeaders[join(__dirname, '../frontend', outputFilePath)] = cacheControl;
        }
    }

    app.use(
        '/',
        express.static(join(__dirname, '../frontend'), {
            setHeaders: (res: Response, path: string) => {
                if (/.+\.(?!html).*$/i.test(path)) {
                    const cacheControl = cacheHeaders[path] ?? 'public, max-age=2678400';

                    res.header('Cache-Control', cacheControl);
                } else {
                    res.header('Cache-Control', 'no-store');
                }
            }
        })
    );

    let pages: string[] = [];
    const cachePages = async (): Promise<void> => {
        const newPages = await Page.findAll({ attributes: ['slug'] }) as Array<Pick<Page, 'slug'>>;

        const slugs = newPages.map(p => p.slug);
        slugs.push('/home');

        pages = slugs;
    };

    Page.addHook('afterCreate', cachePages);
    Page.addHook('afterDestroy', cachePages);
    void cachePages();
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
        if (!req.accepts('application/html')) {
            next();
            return;
        }

        const page = req.path;

        if (pages.length > 0 && !pages.includes(page)) {
            res.status(404);
        }

        res.header('Cache-Control', 'no-store');
        res.sendFile(join(__dirname, '../frontend/index.html'));
    });
}

const {
    PORT = '80'
} = process.env;

const port = Number.parseInt(PORT, 10);

app.listen(port, () => {
    console.log(`
        Server listening on http://localhost:${port}
    `);
});
