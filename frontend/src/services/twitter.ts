import {
    Status as ApiResTweet,
    Entities as TweetEntities,
    HashtagEntity,
    MediaEntity,
    UserMentionEntity,
    UrlEntity,
    FullUser as FullTwitterUser
} from 'twitter-d';
import GraphemeSplitter from 'grapheme-splitter';

import { fetchJSON } from './utils';
import { API_URI } from '.';

export const TWEET_TYPE = 'tweet';
export const RETWEET_TYPE = 'retweet';

interface TwitterUser {
    username: string;
    displayName: string;
    picture: string;
}

interface TweetMedia {
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

export class Tweet {
    public type: string = TWEET_TYPE;
    public date: Date;
    public id: string;
    public caption: string;
    public author: TwitterUser;
    public media: TweetMedia[];

    constructor ({ date, caption, author, media, id }: TweetConstructorArguments) {
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

    constructor ({ date, caption, author, tweet, media, id }: RetweetConstructorArguments) {
        super({ date, caption, author, media, id });
        this.retweetedTweet = tweet;
    }
}

const fields: Array<'hashtags'|'media'|'urls'|'user_mentions'> = ['hashtags', 'media', 'urls', 'user_mentions'];
const splitter = new GraphemeSplitter();

/**
 * @description Enriches text with links to user mentions or hashtags
 * @author DerZade
 * @param {string} text Text
 * @param {TweetEntities} entries Entries to add to the text
 * @returns {string} Enriched text
 */
const enrichTwitterCaption = (text: string, entities: TweetEntities): string => {
    // Each entity has a start and a end position. We have to insert the entities back to front
    // to ensure that we won't fuck up the index-positions of following entities.
    // This means we have to somehow sort all entities, therefore we need an array with all Entities

    // this will contain all entities in the correct order (first entity is last in text)
    const allEntities: Array<{
        type: string;
        end: number;
        start: number;
        entity: HashtagEntity|MediaEntity|UserMentionEntity|UrlEntity;
    }> = [];

    // add all entities to the array
    fields.forEach(field => {
        const arr = entities[field];

        if (!arr) return;

        arr.forEach((entity: HashtagEntity|MediaEntity|UserMentionEntity|UrlEntity) => {
            if (!entity.indices) return;
            allEntities.push({ type: field, start: entity.indices[0], end: entity.indices[1], entity });
        });
    });

    const sortedEntities = allEntities.sort((a, b) => b.end - a.end);

    // now we can start inserting into the text
    sortedEntities.forEach(e => {
        let entity: HashtagEntity | MediaEntity | UserMentionEntity | UrlEntity = e.entity;

        // split the text at the indices position
        const pre = splitter.splitGraphemes(text).slice(0, e.start).join('');
        const mid = splitter.splitGraphemes(text).slice(e.start, e.end).join('');
        const post = splitter.splitGraphemes(text).slice(e.end).join('');

        if (e.type === 'hashtags') {
            entity = entity as HashtagEntity;
            text = [
                pre,
                `<a href="https://twitter.com/hashtag/${entity.text}?src=hash" target="_blank" rel="noreferrer">`,
                mid,
                '</a>',
                post
            ].join('');
        }

        if (e.type === 'media') {
            // media url will be just discarded
            entity = entity as MediaEntity;
            text = [pre, post].join('');
        }

        if (e.type === 'urls') {
            entity = entity as UrlEntity;
            text = [
                pre,
                `<a href="${entity.expanded_url}" target="_blank" rel="noreferrer">`,
                entity.display_url,
                '</a>',
                post
            ].join('');
        }

        if (e.type === 'user_mentions') {
            entity = entity as UserMentionEntity;
            text = [
                pre,
                `<a href="https://twitter.com/${entity.screen_name}" target="_blank" rel="noreferrer">`,
                mid,
                '</a>',
                post
            ].join('');
        }
    });

    return text.replace(/\n/g, '<br />');
};

/**
 * @async
 * @description Retrieves tweets
 * @author DerZade
 * @param {string} maxId MaxId to pass th twitter api (see twitter api GET statuses/user_timeline parameters max_id)
 * (https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html)
 * @returns {Promise<Tweet[]>} Tweets
 */
export async function fetchTweets (maxId?: string): Promise<Tweet[]> {
    const params = maxId !== undefined ? `?max_id=${maxId}&count=50&exclude_replies=true` : '?count=50&exclude_replies=true';

    const responseTweets = await fetchJSON<ApiResTweet[]>(`${API_URI}/api/v1/twitter${params}`);

    const tweets = responseTweets.map(mainTweet => {
        const mainId: string = mainTweet.id_str;

        // author of main tweet
        const mainAuthor: TwitterUser = {
            username: (mainTweet.user as FullTwitterUser).screen_name,
            displayName: (mainTweet.user as FullTwitterUser).name,
            picture: (mainTweet.user as FullTwitterUser).profile_image_url_https
        };

        // media of main tweet
        let mainMedia: TweetMedia[] = [];
        if (mainTweet.extended_entities && mainTweet.extended_entities.media) {
            mainMedia = mainTweet.extended_entities.media.map(m => {
                return {
                    id: m.id,
                    url: m.media_url_https,
                    target: m.expanded_url
                };
            });
        }

        // content of main tweet
        let mainCaption;

        // quoted_status and retweeted_status both contain the tweet that was retweeted with the
        // only difference being that the parent tweet of quoted_status will contain a own comment
        // and parent of retweeted_status is just a retweet of that status without any extra comment
        let retweetedStatus: ApiResTweet|null = null;
        if (mainTweet.quoted_status) {
            retweetedStatus = mainTweet.quoted_status;

            if (Object.prototype.hasOwnProperty.call(mainTweet, 'quoted_status_permalink')) {
                // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-non-null-assertion
                const url = mainTweet.quoted_status_permalink!.url;

                // the full_text of the mainTweet will include a link of the quoted tweet, and we dont want that
                // eslint-disable-next-line @typescript-eslint/camelcase
                mainTweet.full_text = mainTweet.full_text.replace(url, '');

                mainTweet.entities.urls = (mainTweet.entities.urls || []).filter(e => e.url !== url);
            }
            mainCaption = enrichTwitterCaption(mainTweet.full_text, mainTweet.entities);
        } else if (mainTweet.retweeted_status) {
            retweetedStatus = mainTweet.retweeted_status;

            mainCaption = ''; // full_text of main tweet will just contain part of the retweeted full_text
        } else {
            mainCaption = enrichTwitterCaption(mainTweet.full_text, mainTweet.entities);
        }

        if (retweetedStatus !== null) {
            const retweetedId = retweetedStatus.id_str;

            // retweeted media
            let retweetedMedia: TweetMedia[] = [];
            if (retweetedStatus.extended_entities && retweetedStatus.extended_entities.media) {
                retweetedMedia = retweetedStatus.extended_entities.media.map(m => {
                    return {
                        id: m.id,
                        url: m.media_url_https,
                        target: m.expanded_url
                    };
                });
            }

            const retweetedTweet = new Tweet({
                id: retweetedId,
                media: retweetedMedia,
                date: new Date(retweetedStatus.created_at),
                caption: enrichTwitterCaption(retweetedStatus.full_text, retweetedStatus.entities),
                author: {
                    username: (retweetedStatus.user as FullTwitterUser).screen_name,
                    displayName: (retweetedStatus.user as FullTwitterUser).name,
                    picture: (retweetedStatus.user as FullTwitterUser).profile_image_url_https
                }
            });

            // media of retweeted tweet will also appear in media of main tweet and we don't like that shit ^^
            // so remove everything from main tweet media, which already is in retweeted status
            mainMedia = mainMedia.filter(photo => {
                return retweetedMedia.findIndex(retweetedPhoto => retweetedPhoto.id === photo.id) === -1;
            });

            return new Retweet({
                date: new Date(mainTweet.created_at),
                caption: mainCaption,
                media: mainMedia,
                id: mainId,
                author: mainAuthor,
                tweet: retweetedTweet
            });
        }

        // tweet is just regular tweet
        return new Tweet({
            date: new Date(mainTweet.created_at),
            caption: mainCaption,
            media: mainMedia,
            id: mainId,
            author: mainAuthor
        });
    });

    // return tweets without the one specified in maxId
    return tweets.filter(t => t.id !== maxId).sort((a, b) => b.date.getTime() - a.date.getTime());
}
