import { Router, Request, Response } from 'express';
import { globalErrorHandler } from '../utils/express';
import pageRouter from './routes/page.router';
import containerRouter from './routes/container.router';

const v1Router = Router();

v1Router.use('/page', pageRouter)
v1Router.use('/container', containerRouter)

v1Router.use(globalErrorHandler);

export default v1Router;