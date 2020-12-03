import { Router } from 'express';
import { globalErrorHandler, wrapAsync, return422 } from '../../utils/express';
import { TwitterService } from '../../utils/TwitterService';
import { matchedData, query, param } from 'express-validator';
import { HiddenTweet } from '../../models';
import { ssoCheckAuthorized } from '../../utils/sso';

const twitterService = TwitterService.getInstance();

const twitterRouter = Router();

twitterRouter.get('/', [
    query('count').optional().isInt({ gt: 0 }).toInt(),
    query('max_id').optional().isInt(),
    query('exclude_replies').optional().isBoolean().toBoolean(),
    return422
], wrapAsync(async (req, res) => {
    // eslint-disable-next-line camelcase
    const { count, max_id, exclude_replies } = matchedData(req) as { count?: number, max_id?: string, exclude_replies?: boolean };

    const { tweets, lastModified } = await twitterService.getTweets(max_id, count, exclude_replies);

    res.header('Cache-Control', 'no-cache');
    res.header('Last-Modified', lastModified.toUTCString());

    res.json(tweets);
}));

// get hidden tweets
twitterRouter.get('/hidden', wrapAsync(async (req, res) => {
    const tweets = await HiddenTweet.findAll();

    res.json(tweets.map(x => x.id));
}));

// hide tweet
twitterRouter.post('/hidden/:id', [
    ssoCheckAuthorized,
    param('id').isInt({ gt: 0 }),
    return422
], wrapAsync(async (req, res) => {
    const { id } = matchedData(req) as { id: number };

    await HiddenTweet.findOrCreate({ where: { id } });

    res.send(200).end();
}));

// unhide tweet
twitterRouter.delete('/hidden/:id', [
    ssoCheckAuthorized,
    param('id').isInt({ gt: 0 }),
    return422
], wrapAsync(async (req, res) => {
    const { id } = matchedData(req) as { id: number };

    await HiddenTweet.destroy({ where: { id } });

    res.send(200).end();
}));

twitterRouter.use(globalErrorHandler);

export default twitterRouter;
