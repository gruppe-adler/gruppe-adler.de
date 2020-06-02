import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const wrapAsync = (fn: RequestHandler): RequestHandler => (
    (req: Request, res: Response, next: NextFunction): void => {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    }
);

export const globalErrorHandler = (err: unknown, req: Request, res: Response): void => {
    // console.error(err);
    debugger;
    const status = (Object.prototype.hasOwnProperty.call(err, 'status')) ? (err as { status: number }).status : 500;
    res.status(status).end();
};

export function return422(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}
