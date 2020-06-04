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

import v1Router from './v1';

import './database';

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

// api
app.use('/api/v1', v1Router);

// frontend
if (existsSync(join(__dirname, '../frontend'))) {
    app.use('/', express.static(join(__dirname, '../frontend')));
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
