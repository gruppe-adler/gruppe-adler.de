import { Router } from 'express';
import { globalErrorHandler, wrapAsync, return422 } from '../../utils/express';
import { TwitterService } from '../../utils/TwitterService';
import { matchedData, query } from 'express-validator';

const twitterService = TwitterService.getInstance();

const twitterRouter = Router();

twitterRouter.get('/', [
    query('count').optional().isInt({ gt: 0 }),
    query('max_id').optional().isString(),
    return422
], wrapAsync(async (req, res) => {
    // eslint-disable-next-line camelcase
    const { count, max_id } = matchedData(req) as { count: number, max_id?: string };

    const tweets = await twitterService.getTweets(`${count}`, max_id);
    res.json(tweets);
}));

twitterRouter.use(globalErrorHandler);

export default twitterRouter;
