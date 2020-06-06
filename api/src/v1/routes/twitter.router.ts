import { Router } from 'express';
import { globalErrorHandler, wrapAsync, return422 } from '../../utils/express';
import { TwitterService } from '../../utils/TwitterService';
import { matchedData, query } from 'express-validator';

const twitterService = TwitterService.getInstance();

const twitterRouter = Router();

twitterRouter.get('/', [
    query('count').optional().isInt({ gt: 0 }),
    query('max_id').optional().isString(),
    query('exclude_replies').optional().isBoolean(),
    return422
], wrapAsync(async (req, res) => {
    // eslint-disable-next-line camelcase
    const { count, max_id, exclude_replies } = matchedData(req) as { count: number, max_id?: string, exclude_replies?: boolean };

    const tweets = await twitterService.getTweets(count, max_id, exclude_replies);
    res.json(tweets);
}));

twitterRouter.use(globalErrorHandler);

export default twitterRouter;
