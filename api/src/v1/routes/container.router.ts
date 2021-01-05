import { Router } from 'express';
import { wrapAsync, globalErrorHandler, return422 } from '../../utils/express';
import { param, body, matchedData } from 'express-validator';
import { Container } from '../../models';
import { ssoCheckAuthorized } from '../../utils/sso';
import ReponseError from '../../utils/ResponseError';

const defaultContainerRules = [
    body('heading').optional().isString(),
    body('footer').optional().isString(),
    body('content').optional().isString(),
    body('headerColor').optional().custom(val => val === null || typeof val === 'string'),
    body('headerImage').optional().custom(val => val === null || typeof val === 'string'),
    body('pinnedImage').optional().custom(val => val === null || typeof val === 'string'),
    body('index').optional().isInt().toInt()
];

type OptionalContainerFields = Partial<Pick<Container, 'heading'|'footer'|'content'|'headerColor'|'headerImage'|'pinnedImage'|'index'>>;

const containerRouter = Router();

containerRouter.post('/', [
    ssoCheckAuthorized,
    ...defaultContainerRules,
    body('pageSlug').isString(),
    return422
], wrapAsync(async (req, res) => {
    const data = matchedData(req) as OptionalContainerFields & Pick<Container, 'pageSlug'>;

    const container = await Container.create(data);

    res.status(201).json(container);
}));

containerRouter.put('/:id', [
    ssoCheckAuthorized,
    param('id').isInt().toInt(),
    ...defaultContainerRules,
    body('pageSlug').optional().isString(),
    return422
], wrapAsync(async (req, res) => {
    const { id, ...updateData } = matchedData(req) as OptionalContainerFields & Partial<Pick<Container, 'pageSlug'>> & Pick<Container, 'id'>;

    const container: Container|null = await Container.findByPk(id);

    if (container === null) {
        throw new ReponseError(404, `Container with id '${id}' not found.`);
    }

    const updatedContainer = await container.update(updateData);

    res.json(updatedContainer);
}));

containerRouter.delete('/:id', [
    ssoCheckAuthorized,
    param('id').isInt().toInt(),
    return422
], wrapAsync(async (req, res) => {
    const { id } = matchedData(req) as { id: number };

    const container: Container|null = await Container.findByPk(id);

    if (container === null) {
        throw new ReponseError(404, `Container with id '${id}' not found.`);
    }

    await container.destroy();

    res.end();
}));

containerRouter.use(globalErrorHandler);

export default containerRouter;
