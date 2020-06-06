import fetch, { Response } from 'node-fetch';
import ReponseError from './ResponseError';

import { Status as Tweet } from 'twitter-d/types/status';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config/config.json');

export class TwitterService {
    private twitterBearerToken: string|null = null;
    private twitterBearerTokenCreated = 0;
    private static instance: TwitterService|null = null;

    // this constructor is actually important to make sure it is private (singleton pattern)
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance(): TwitterService {
        if (this.instance === null) {
            this.instance = new TwitterService();
        }

        return this.instance;
    }

    public async getTweets(count?: number, maxId?: string, excludeReplies?: boolean): Promise<Tweet[]> {
        const url = new URL('https://api.twitter.com/1.1/statuses/user_timeline.json');

        url.searchParams.append('screen_name', config.twitter['screen-name']);
        url.searchParams.append('tweet_mode', 'extended');

        if (count !== undefined) url.searchParams.append('count', `${count}`);
        if (maxId !== undefined) url.searchParams.append('max_id', maxId);
        if (excludeReplies !== undefined) url.searchParams.append('exclude_replies', `${excludeReplies}`);

        const bearerToken = await this.getToken();

        let response: Response;
        try {
            response = await fetch(url.toString(), { headers: { Authorization: `Bearer ${bearerToken}` } });
        } catch (err) {
            console.error(err);
            throw new ReponseError(504);
        }

        if (!response.ok) {
            console.error(`Error while trying to fetch tweets. API responded with status code ${response.status}.`);
            throw new ReponseError(502);
        }

        return await response.json() as Tweet[];
    }

    private async getToken(): Promise<string> {
        if (this.twitterBearerToken == null) {
            return this.requestNewToken();
        } else if ((new Date()).getTime() > this.twitterBearerTokenCreated + 900000) {
            // get new token if last token is older than 15 minutes
            return this.requestNewToken();
        }

        return this.twitterBearerToken;
    }

    private async requestNewToken(): Promise<string> {
        let response: Response;
        try {
            response = await fetch('https://api.twitter.com/oauth2/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${config.twitter['base64-bearer-token-credentials']}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8.'
                },
                body: 'grant_type=client_credentials'
            });
        } catch (err) {
            console.error(err);
            throw new ReponseError(504);
        }

        if (!response.ok) {
            console.error(`Error while trying to request new token for twitter API. API responded with status code ${response.status}.`);
            throw new ReponseError(502);
        }

        // eslint-disable-next-line camelcase
        const json = await response.json() as { access_token: string };

        this.twitterBearerToken = json.access_token;
        this.twitterBearerTokenCreated = (new Date()).getTime();

        return this.twitterBearerToken;
    }
}
