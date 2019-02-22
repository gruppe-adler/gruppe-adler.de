import { BlogEntry } from './Blogentry';

export const TWEET_TYPE = 'Tweet';

export class Tweet implements BlogEntry {
    public type: string = TWEET_TYPE;
    public date: Date;

    constructor({ date }: { date: Date }) {
        this.date = date;
    }
}
