import { Router } from 'express';
import { wrapAsync, globalErrorHandler, return422 } from '../../utils/express';
import { Page } from '../../models';
import { body, matchedData } from 'express-validator';
import { ssoCheckAuthorized } from '../../utils/sso';
import ResponseError from '../../utils/ResponseError';

const pageRouter = Router();

pageRouter.get('/*', wrapAsync(async (req, res) => {
    const slug = req.path;

    const page = await Page.findByPk(slug);

    if (page === null) {
        throw new ResponseError(404, `Page with slug '${slug}' not found.`);
    }

    res.header('Cache-Control', 'no-cache');
    res.header('Last-Modified', page.updatedAt.toUTCString());
    res.json(page);
}));

pageRouter.put('/*', [
    ssoCheckAuthorized,
    body('toc').optional().isBoolean().toBoolean(),
    body('description').optional(),
    body('title').optional(),
    body('priority').optional().isFloat({ min: 0, max: 1 }).toFloat(),
    return422
], wrapAsync(async (req, res) => {
    const slug = req.path;

    const updateData = matchedData(req) as Partial<Pick<Page, 'toc' | 'description' | 'title' | 'priority'>>;

    const page: Page | null = await Page.findByPk(slug);

    if (page === null) {
        throw new ResponseError(404, `Page with slug '${slug}' not found.`);
    }

    const updatedPage = await page.update(updateData);

    res.json(updatedPage);
}));

pageRouter.post('/', [
    ssoCheckAuthorized,
    body('slug').isString(),
    body('toc').optional().isBoolean().toBoolean(),
    body('description').optional(),
    body('title').optional(),
    body('priority').optional().isFloat({ min: 0, max: 1 }).toFloat(),
    return422
], wrapAsync(async (req, res) => {
    const data = matchedData(req) as Partial<Pick<Page, 'toc' | 'description' | 'title' | 'priority'>> & Pick<Page, 'slug'>;

    const page = await Page.create(data);

    res.status(201).json(page);
}));

pageRouter.delete('/*', [
    ssoCheckAuthorized
], wrapAsync(async (req, res) => {
    const slug = req.path;

    const page: Page | null = await Page.findByPk(slug);

    if (page === null) {
        throw new ResponseError(404, `Container with slug '${slug}' not found.`);
    }

    await page.destroy();

    res.end();
}));

pageRouter.use(globalErrorHandler);

export default pageRouter;
