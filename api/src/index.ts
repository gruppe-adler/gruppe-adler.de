import { join } from 'path';
import { existsSync } from 'fs';

// eslint-disable-next-line import/no-duplicates
import * as express from 'express';
// eslint-disable-next-line import/no-duplicates
import { Request, Response, NextFunction } from 'express';

import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

import v1Router from './v1';

import './database';
import { getSitemap } from './utils/sitemap';

const app = express();

// cors
app.use(cors({
    credentials: true,
    origin: [
        new RegExp('gruppe-adler.de$', 'i'),
        new RegExp('localhost:[0-9]+$', 'i'),
        new RegExp('127.0.0.1:[0-9]+$', 'i'),
        new RegExp('127.0.0.1$', 'i'),
        new RegExp('localhost$', 'i')
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

app.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    try {
        const sitemap = await getSitemap();
        res.send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

// frontend
if (existsSync(join(__dirname, '../frontend'))) {
    app.use(
        '/',
        express.static(join(__dirname, '../frontend'), {
            setHeaders: (res: Response, path: string) => {
                if (/.+\.(?!html).*$/i.test(path)) {
                    res.header('Cache-Control', 'public, max-age=2678400');
                } else {
                    res.header('Cache-Control', 'no-store');
                }
            }
        })
    );
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
        if (!req.accepts('application/html')) {
            next();
            return;
        }

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
