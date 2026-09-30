import { Router } from 'express';
import { globalErrorHandler, wrapAsync } from '../../utils/express.js';
import { UploadService } from '../../utils/UploadService.js';
import ResponseError from '../../utils/ResponseError.js';
import bodyParser from 'body-parser';
import { requireAuth } from './auth.router.js';

const uploadService = UploadService.getInstance();

const uploadRouter = Router();

uploadRouter.post('/', [
    bodyParser.raw({ type: 'image/*', limit: '20mb' }),
    requireAuth
], wrapAsync(async (req, res) => {
    res.setHeader('Accept', UploadService.ALLOWED_MIME_TYPES.join(', '));

    const contentTypeHeader = req.get('Content-Type') ?? '';
    const mime = contentTypeHeader.toLowerCase();

    if (!UploadService.ALLOWED_MIME_TYPES.includes(mime)) {
        throw new ResponseError(415);
    }

    const fileName = uploadService.saveFile(req.body, mime);

    res.status(201).json({ fileName });
}));

uploadRouter.use(globalErrorHandler);

export default uploadRouter;
