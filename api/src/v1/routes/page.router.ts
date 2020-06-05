import { Router } from 'express';
import { wrapAsync, globalErrorHandler, return422 } from '../../utils/express';
import { Page } from '../../models';
import { body, matchedData } from 'express-validator';
import { ssoCheckAuthorized } from '../../utils/sso';
import ReponseError from '../../utils/ResponseError';

const pageRouter = Router();

pageRouter.get('/*', wrapAsync(async (req, res) => {
    const slug = req.path;

    const page = await Page.findByPk(slug) as Page|null;

    if (page === null) {
        throw new ReponseError(404, `Page with slug '${slug}' not found.`);
    }

    res.json(page);
}));

pageRouter.put('/*', [
    ssoCheckAuthorized,
    body('slug').optional().isString(),
    body('toc').optional().isBoolean(),
    return422
], wrapAsync(async (req, res) => {
    const slug = req.path;

    const updateData = matchedData(req) as { slug: string, toc?: boolean };

    const page: Page|null = await Page.findByPk(slug);

    if (page === null) {
        throw new ReponseError(404, `Page with slug '${slug}' not found.`);
    }

    const updatedPage = await page.update(updateData);

    res.json(updatedPage);
}));

pageRouter.post('/', [
    ssoCheckAuthorized,
    body('slug').isString(),
    body('toc').optional().isBoolean(),
    return422
], wrapAsync(async (req, res) => {
    const data = matchedData(req) as { slug: string, toc?: boolean };

    const page = await Page.create(data);

    res.status(201).json(page);
}));

// pageRouter.all('*', (req, res) => {
//     res.status(404).end();
// });

pageRouter.use(globalErrorHandler);

export default pageRouter;