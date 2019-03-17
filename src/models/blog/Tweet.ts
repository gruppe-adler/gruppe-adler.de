import { BlogEntry } from './BlogEntry';
import { TwitterUser } from './TwitterUser';

export const TWEET_TYPE = 'Tweet';
export const RETWEET_TYPE = 'ReTweet';


export interface TweetMedia {
    id: number;
    url: string;
    target: string;
}

interface TweetConstructorArguments {
    date: Date;
    caption: string;
    author: TwitterUser;
    media: TweetMedia[];
    id: string;
}

interface RetweetConstructorArguments extends TweetConstructorArguments {
    tweet: Tweet;
}

export class Tweet implements BlogEntry {
    public type: string = TWEET_TYPE;
    public date: Date;
    public id: string;
    public caption: string;
    public author: TwitterUser;
    public media: TweetMedia[];

    constructor({ date, caption, author, media, id }: TweetConstructorArguments) {
        this.id = id;
        this.date = date;
        this.caption = caption;
        this.author = author;
        this.media = media;
    }
}

export class Retweet extends Tweet {
    public type: string = RETWEET_TYPE;
    public retweetedTweet: Tweet;

    constructor({ date, caption, author, tweet, media, id }: RetweetConstructorArguments) {
        super({date, caption, author, media, id});
        this.retweetedTweet = tweet;
    }
}
