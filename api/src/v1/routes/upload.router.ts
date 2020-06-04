import { Router } from 'express';
import { globalErrorHandler, wrapAsync } from '../../utils/express';
import { UploadService } from '../../utils/UploadService';
import { ssoCheckAuthorized } from '../../utils/sso';
import ReponseError from '../../utils/ResponseError';
import * as bodyParser from 'body-parser';

const uploadService = UploadService.getInstance();

const uploadRouter = Router();

uploadRouter.post('/', [
    bodyParser.raw({ type: 'image/*', limit: '20mb' }),
    ssoCheckAuthorized
], wrapAsync(async (req, res) => {
    res.setHeader('Accept', UploadService.ALLOWED_MIME_TYPES.join(', '));

    const contentTypeHeader = req.get('Content-Type');
    const mime = contentTypeHeader.toLowerCase();

    if (!UploadService.ALLOWED_MIME_TYPES.includes(mime)) {
        throw new ReponseError(415);
    }

    const fileName = uploadService.saveFile(req.body, mime);

    res.status(201).json({ fileName });
}));

uploadRouter.use(globalErrorHandler);

export default uploadRouter;
