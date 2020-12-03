import fetch, { Response } from 'node-fetch';
import ReponseError from './ResponseError';

import { Status as Tweet } from 'twitter-d/types/status';
import * as equals from 'fast-deep-equal';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config/config.json');

export class TwitterService {
    private twitterBearerToken: string|null = null;
    private twitterBearerTokenCreated = 0;
    private cachedTweets: Tweet[] = [];
    private cachedDate: Date = new Date(0);
    private cachePromise: Promise<void>;
    private lastModified: Date = new Date(0);
    private static instance: TwitterService|null = null;

    // this constructor is actually important to make sure it is private (singleton pattern)
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        this.cachedDate = new Date();
        this.cachePromise = this.cacheAllTweets();
    }

    public static getInstance(): TwitterService {
        if (this.instance === null) {
            this.instance = new TwitterService();
        }

        return this.instance;
    }

    public async getTweets(maxId?: string, count = 20, excludeReplies = false): Promise<{ tweets: Tweet[], lastModified: Date }> {
        // fetch new tweets if last fetch is more than 15min ago
        const now = new Date();
        if (now.getTime() > this.cachedDate.getTime() + 900000) {
            this.cachedDate = now;
            this.cachePromise = this.cacheAllTweets();
        }

        await this.cachePromise;

        let startIndex = 0;

        if (maxId !== undefined) {
            const maxIdIndex = this.cachedTweets.findIndex(t => t.id_str === maxId);
            if (maxIdIndex > -1) startIndex = maxIdIndex;
        }

        let tweets: Tweet[] = [];
        if (excludeReplies) {
            let i = startIndex;

            while (tweets.length < count && i < this.cachedTweets.length) {
                const tweet = this.cachedTweets[i];
                if (tweet.in_reply_to_status_id === null) tweets.push(tweet);
                i++;
            }
        } else {
            tweets = this.cachedTweets.slice(startIndex, startIndex + count);
        }

        return { tweets, lastModified: this.lastModified };
    }

    public async cacheAllTweets(): Promise<void> {
        const allTweets: Tweet[] = [];
        let maxId: string|undefined;

        while (true) {
            let tweets = await this.fetchTweets(maxId);

            if (tweets.length > 0 && tweets[0].id_str === maxId) tweets = tweets.slice(1);

            if (tweets.length === 0) break;

            allTweets.push(...tweets);

            maxId = tweets[tweets.length - 1].id_str;
        }

        if (!equals(this.cachedTweets, allTweets)) {
            this.cachedTweets = allTweets;
            this.lastModified = new Date();
        }
    }

    private async fetchTweets(maxId?: string): Promise<Tweet[]> {
        const url = new URL('https://api.twitter.com/1.1/statuses/user_timeline.json');

        url.searchParams.append('screen_name', config.twitter['screen-name']);
        url.searchParams.append('tweet_mode', 'extended');
        url.searchParams.append('count', '200');

        if (maxId !== undefined) url.searchParams.append('max_id', maxId);

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

        return response.json() as Promise<Tweet[]>;
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
