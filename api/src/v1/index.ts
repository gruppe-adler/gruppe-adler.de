import { Router } from 'express';
import { globalErrorHandler } from '../utils/express.js';
import pageRouter from './routes/page.router.js';
import containerRouter from './routes/container.router.js';
import uploadRouter from './routes/upload.router.js';
import eventsRouter from './routes/events.router.js';

const v1Router = Router();

v1Router.use('/page', pageRouter);
v1Router.use('/container', containerRouter);
v1Router.use('/upload', uploadRouter);
v1Router.use('/events', eventsRouter);

v1Router.use(globalErrorHandler);

export default v1Router;
