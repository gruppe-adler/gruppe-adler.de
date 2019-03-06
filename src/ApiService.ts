import { CmsPage } from '@/models/cms/Page';
import { Page } from './models/Page';
import rp from 'request-promise-native';
import { BlogPost } from './models/blog/BlogPost';
import { Container } from './models/Container';
import { Tweet, Retweet, TweetMedia } from './models/blog/Tweet';
import {
    Status as ApiResTweet,
    Entities as TweetEntities,
    HashtagEntity,
    MediaEntity,
    UserMentionEntity,
    UrlEntity
} from 'twitter-d';
import GraphemeSplitter from 'grapheme-splitter';
import { TwitterUser } from './models/blog/TwitterUser';

const CMS_URL = 'https://cms.dev.gruppe-adler.de/';
const API_URL = 'https://api.dev.gruppe-adler.de/';
const CMS_TOKEN = 'acacff37c21c30b6e6569e958fa7be';


export default class ApiService {
    public static async getPage(slug: string): Promise<CMSPage | null> {

        let response = { total: 0, entries: [] };
        const rpOptions = {
            method: 'POST',
            uri: `${CMS_URL}api/collections/get/page`,
            headers: {
                'Authorization': `Bearer ${CMS_TOKEN}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    slug
                },
                fields: {
                    toc: 1,
                    containers: 1
                },
                populate: 1
            })
        };

        try {
            response = JSON.parse(await rp(rpOptions));
        } catch (err) {
            throw err;
        }

        if (response.total === 0) throw new Error(`Page '${slug}' was not found`);

        const page = response.entries[0] as CmsPage;
        const containers: Container[] = page.containers.map(c => {
            return {
                id: c._id,
                heading: c.heading,
                content: c.content,
                footer: c.footer,
                headerColor: c.headerColor,
                headerImage: this.normalizeImage(c.headerImage),
                pinnedImage: this.normalizeImage(c.pinnedImage)
            } as Container;
        });

        return {
            toc: page.toc,
            containers
        };
    }

    public static async getTweets(): Promise<Tweet[]> {

        let response: ApiResTweet[];
        try {
            response = JSON.parse(await rp(`${API_URL}twitter/feed`));
        } catch (err) {
            throw err;
        }

        const tweets: Tweet[] = response.map(mainTweet => {

            // author of main tweet
            const mainAuthor: TwitterUser = {
                username: mainTweet.user.screen_name,
                displayName: mainTweet.user.name,
                picture: mainTweet.user.profile_image_url_https
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
            let mainCaption = this.enrichTwitterCaption(mainTweet.full_text, mainTweet.entities);

            // quoted_status and retweeted_status both contain the tweet that was retweeted with the
            // only difference being that the parent tweet of quoted_status will contain a own comment
            // and parent of retweeted_status is just a retweet of that status without any extra comment
            let retweetedStatus: ApiResTweet|null = null;
            if (mainTweet.quoted_status) {
                retweetedStatus = mainTweet.quoted_status;
            } else if (mainTweet.retweeted_status) {
                retweetedStatus = mainTweet.retweeted_status;

                mainCaption = ''; // full_text of main tweet will just contain part of the retweeted full_text
            }

            if (retweetedStatus) {

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
                    media: retweetedMedia,
                    date: new Date(retweetedStatus.created_at),
                    caption: this.enrichTwitterCaption(retweetedStatus.full_text, retweetedStatus.entities),
                    author: {
                        username: retweetedStatus.user.screen_name,
                        displayName: retweetedStatus.user.name,
                        picture: retweetedStatus.user.profile_image_url_https
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
                    author: mainAuthor,
                    tweet: retweetedTweet
                });
            }

            // tweet is just regular tweet
            return new Tweet({
                date: new Date(mainTweet.created_at),
                caption: mainCaption,
                media: mainMedia,
                author: mainAuthor
            });
        });

        return tweets;
    }
    public static async getBlogPosts(): Promise<BlogPost[]> {

        // let response = { total: 0, entries: [] };
        // const rpOptions = {
        //     method: 'POST',
        //     uri: `${CMS_URL}api/collections/get/page`,
        //     headers: {
        //         'Authorization': `Bearer ${CMS_TOKEN}`,
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         filter: {
        //             slug
        //         },
        //         fields: {
        //             toc: 1,
        //             containers: 1
        //         },
        //         populate: 1
        //     })
        // };

        // try {
        //     response = JSON.parse(await rp(rpOptions));
        // } catch (err) {
        //     throw err;
        // }

        // if (response.total === 0) throw new Error(`Page '${slug}' was not found`);

        // const page = response.entries[0] as ApiResPage;
        // const containers: Container[] = page.containers.map(c => {
        //     return {
        //         id: c._id,
        //         heading: c.heading,
        //         content: c.content,
        //         footer: c.footer,
        //         headerColor: c.headerColor,
        //         headerImage: this.normalizeImage(c.headerImage),
        //         pinnedImage: this.normalizeImage(c.pinnedImage)
        //     } as Container;
        // });

        // return {
        //     toc: page.toc,
        //     containers
        // };

        return [];
    }

    /**
     * @param {any} response Image response
     * @returns {string} Complete image url
     */
    public static normalizeImage(response: any): string {
        if (Array.isArray(response)) return '';
        response = response as { path: string };

        let path = response.path;

        if (!path) return '';

        // if path starts with a '/' it is probably a relative path
        if (path.match(/^\/.*/i)) {
            path = `${CMS_URL}${path.substr(1)}`;
        }

        return path;
    }

    /**
     * Enriches text with links to user mentions or hashtags
     * @param {string} text Text
     * @param {TweetEntities} entries Entries to add to the text
     * @returns {string} Enriched text
     */
    public static enrichTwitterCaption(text: string, entries: TweetEntities): string {

        // Each entity has a start and a end position. We have to insert the entities back to front
        // to ensure that we won't fuck up the index-positions of following entities.
        // This means we have to somehow sort all entities, therefore we need an array.

        // this will contain all entities in the correct order (first entity is last in text)
        let sortedEntries: Array<{
            type: string,
            end: number,
            entity: HashtagEntity|MediaEntity|UserMentionEntity|UrlEntity
        }> = [];

        // add all entities to the array
        ['hashtags', 'media', 'urls', 'user_mentions'].forEach((field: string) => {
            if (entries.hasOwnProperty(field)) {
                // @ts-ignore
                entries[field].forEach((entity: HashtagEntity|MediaEntity|UserMentionEntity|UrlEntity) => {
                    if (entity.indices) {
                        sortedEntries.push({type: field, end: entity.indices[1], entity});
                    }
                });
            }
        });

        // actually sort the array
        sortedEntries = sortedEntries.sort((a, b) => b.end - a.end);

        const splitter = new GraphemeSplitter();

        // now we can start inserting into the text
        sortedEntries.forEach(e => {
            let entity: HashtagEntity | MediaEntity | UserMentionEntity | UrlEntity = e.entity;

            // split the text on the indices position
            const pre = splitter.splitGraphemes(text).slice(0, entity.indices![0]).join('');
            const mid = splitter.splitGraphemes(text).slice(entity.indices![0], entity.indices![1]).join('');
            const post = splitter.splitGraphemes(text).slice(entity.indices![1]).join('');

            if (e.type === 'hashtags') {
                entity = entity as HashtagEntity;
                text = [
                    pre,
                    `<a target="_blank" href="https://twitter.com/hashtag/${entity.text}?src=hash">`,
                    mid,
                    '</a>',
                    post
                ].join('');
            }

            if (e.type === 'media') {
                entity = entity as MediaEntity;
                text = [pre, post].join('');
            }

            if (e.type === 'urls') {
                entity = entity as UrlEntity;
                text = [
                    pre,
                    `<a target="_blank" href="${entity.expanded_url}">`,
                    mid,
                    '</a>',
                    post
                ].join('');
            }

            if (e.type === 'user_mentions') {
                entity = entity as UserMentionEntity;
                text = [
                    pre,
                    `<a target="_blank" href="https://twitter.com/${entity.screen_name}">`,
                    mid,
                    '</a>',
                    post
                ].join('');
            }

        });

        return text.replace(/\n/g, '<br />');
    }
}
