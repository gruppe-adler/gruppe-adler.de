import { Router, Request, Response } from 'express';
import { wrapAsync, globalErrorHandler, return422 } from '../../utils/express';
import { param, check, body, oneOf, matchedData } from 'express-validator';
import { Container } from '../../models';
import { ssoCheckAuthorized } from '../../utils/sso';

const defaultContainerRules = [
    body('heading').optional().isString(),
    body('footer').optional().isString(),
    body('content').optional().isString(),
    body('headerColor').optional().custom(val => val === null || typeof val === 'string'),
    body('headerImage').optional().custom(val => val === null || typeof val === 'string'),
    body('pinnedImage').optional().custom(val => val === null || typeof val === 'string'),
    body('index').optional().isInt(),  
];

type defaultContainerData = {
    heading?: string,
    footer?: string,
    content?: string,
    headerColor?: string|null,
    headerImage?: string|null,
    pinnedImage?: string|null,
    index?: number,
};

const containerRouter = Router();

containerRouter.post('/', [
    ssoCheckAuthorized,
    ...defaultContainerRules,
    body('pageSlug').isString(),
    return422
], wrapAsync(async (req, res) => {
    const data = matchedData(req) as defaultContainerData & { pageSlug: string };

    const container = await Container.create(data)

    res.status(201).json(container);
}));

containerRouter.put('/:id',[
    ssoCheckAuthorized,
    param('id').isInt(),
    ...defaultContainerRules,
    body('pageSlug').optional().isString(),
    return422
], wrapAsync(async (req, res) => {
    const { id, ...updateData } = matchedData(req) as defaultContainerData & { id: number, pageSlug?: string };

    const container: Container|null = await Container.findByPk(id);

    if (container === null) {
        throw {status: 404, responseMessage: `Container with id '${id}' not found.`}
    }

    const updatedContainer = await container.update(updateData)

    res.json(updatedContainer);
}));

containerRouter.delete('/:id',[
    ssoCheckAuthorized,
    param('id').isInt(),
    return422
], wrapAsync(async (req, res) => {
    const { id } = matchedData(req) as { id: number };

    const container: Container|null = await Container.findByPk(id);

    if (container === null) {
        throw {status: 404, responseMessage: `Container with id '${id}' not found.`}
    }

    await container.destroy()

    res.end();
}));

containerRouter.use(globalErrorHandler);

export default containerRouter;