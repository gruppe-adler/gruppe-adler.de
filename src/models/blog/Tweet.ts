import { BlogEntry } from './Blogentry';
import { TwitterUser } from './TwitterUser';

export const TWEET_TYPE = 'Tweet';
export const RETWEET_TYPE = 'ReTweet';

export class Tweet implements BlogEntry {
    public type: string = TWEET_TYPE;
    public date: Date;
    public caption: string;
    public author: TwitterUser;

    constructor({ date, caption, author }: { date: Date, caption: string, author: TwitterUser }) {
        this.date = date;
        this.caption = caption;
        this.author = author;
    }
}

export class Retweet extends Tweet {
    public type: string = RETWEET_TYPE;
    public retweetedTweet: Tweet;

    constructor({ date, caption, author, tweet }: { date: Date, caption: string, author: TwitterUser, tweet: Tweet }) {
        super({date, caption, author});
        this.retweetedTweet = tweet;
    }
}
