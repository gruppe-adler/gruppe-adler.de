<template>
    <Content>
        <ActionButtons v-if="isLoggedIn && blogEntries.length > 0">
            <ActionButton icon="add" tooltip="Artikel verfassen" @click="$router.push('/blog/write')" />
        </ActionButtons>
        <template v-if="blogEntries.length > 0">
            <transition-group name="grad-blog-entry--transition" tag="div" class="grad-blog-wrapper" ref="wrapper">
                <template v-for="entry in blogEntries">
                    <BlogPost 
                        v-if="isBlogPost(entry)"
                        :model="entry"
                        :isLoggedIn="isLoggedIn"
                        :key="`blogpost-${entry.id}`"
                    />
                    <Tweet
                        v-else
                        :model="entry"
                        :key="`tweet-${entry.id}`"
                    />
                </template>
            </transition-group>
        </template>
        <Loader v-if="loading && !loadingError" />
        <a v-if="!loading && !loadingError" key="load-more" class="grad-blog__load-more" @click="loadMore">Mehr laden</a>
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Blogposts etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
    </Content>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import BlogPostVue from '@/components/Blog/BlogPost.vue';
import TweetVue from '@/components/Blog/Tweet.vue';
import ActionButtonVue from '@/components/ActionButton.vue';
import ActionButtonsVue from '@/components/ActionButtons.vue';

import { BlogEntry } from '@/models/blog/BlogEntry';
import { BlogPost, BLOG_POST_TYPE } from '@/models/blog/BlogPost';
import { Tweet } from '@/models/blog/Tweet';
import { EVENT_REPORT_TYPE } from '@/models/blog/BlogPostEvent';
import { MOD_UPDATE_TYPE } from '@/models/blog/BlogPostModset';

import ApiService from '@/ApiService';

@Component({
    components: {
        BlogPost: BlogPostVue,
        Tweet: TweetVue,
        ActionButton: ActionButtonVue,
        ActionButtons: ActionButtonsVue
    }
})
export default class HomeVue extends Vue {
    private loadingError: boolean = false;
    private loading: boolean = true;
    private tweets: Tweet[] = [];
    private blogPosts: BlogPost[] = [];
    private blogEntries: BlogEntry[] = [];
    private scrollTimeout: number | null = null;
    private scrollListenerAdded: boolean = false;

    private created() {
        this.fetchBlogData();
    }

    private beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    @Watch('$route')
    private routeChanged(to: Route, from: Route) {
        if (to.path === from.path) return;

        this.updateBlogEntries();
    }

    @Watch('$root.$data.user')
    private onLoginOut() {
        window.removeEventListener('scroll', this.handleScroll);
        this.blogEntries = [];
        this.blogPosts = [];
        this.tweets = [];

        this.fetchBlogData();
    }

    /**
     * @description Fetches blog data (incl. tweets and posts)
     * @author DerZade
     */
    private async fetchBlogData() {
        this.loading = true;
        this.loadingError = false;

        // fetch blog posts
        let newBlogPosts: BlogPost[] = [];
        try {
            newBlogPosts = await ApiService.getBlogPosts(this.blogPosts.length, this.isLoggedIn);
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }
        this.blogPosts = [ ...this.blogPosts, ...newBlogPosts ];

        // fetch tweets
        const oldestTweet: Tweet = this.tweets[this.tweets.length - 1];
        const oldestTweetId = oldestTweet && oldestTweet.id;
        let newTweets: Tweet[] = [];
        try {
            newTweets = await ApiService.getTweets(oldestTweetId);
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }
        this.tweets = [ ...this.tweets, ...newTweets ];

        this.updateBlogEntries();
        this.loading = false;
    }

    /**
     * @description Populates this.blogEntries with blogposts/tweets acc. to applied filter
     * @author DerZade
     */
    private updateBlogEntries() {
        let arr: BlogEntry[] = [];
        const path = this.$route.path.replace(/^\/home/i, '');

        if (path === '/alles') {
            // route /alles should include blogposts as well as tweets
            arr = arr.concat(this.blogPosts).concat(this.tweets);
        } else if (path === '/tweets') {
            // route /tweets should just include tweets
            arr = this.tweets;
        } else {
            // other routes include a subset of just blogposts
            // @ts-ignore
            const filteredType = {
                '/allgemeines': BLOG_POST_TYPE,
                '/events': EVENT_REPORT_TYPE,
                '/modset': MOD_UPDATE_TYPE
            }[path.toLowerCase()];

            if (!filteredType) {
                this.blogEntries = [];
                return;
            }

            arr = this.blogPosts.filter(x => x.type === filteredType);
        }

        // sort arr and set as entries
        this.blogEntries = arr.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    /**
     * @description Click callback for "load more" button fetches more blogpost and adds scroll event listener
     * @author DerZade
     */
    private loadMore() {
        this.fetchBlogData();

        if (this.scrollListenerAdded) return;

        this.scrollListenerAdded = true;

        window.addEventListener('scroll', this.handleScroll);
    }

    /**
     * @description Check whether blogentry is blogpost
     * @author DerZade
     * @param {BlogEntry} entry Blog entry to examine
     * @returns {boolean} Entry is blogpost?
     */
    private isBlogPost(entry: BlogEntry): boolean {
        return [BLOG_POST_TYPE, EVENT_REPORT_TYPE, MOD_UPDATE_TYPE].includes(entry.type);
    }

    /**
     * @description Check if user is logged in
     * @author DerZade
     * @returns {boolean} User logged in?
     */
    private get isLoggedIn(): boolean {
        // @ts-ignore
        return this.$root.isLoggedIn() || false;
    }

    /**
     * @description Scroll event callback. Calls function to check wether bottom of page hase been reached via a timeout
     * @author DerZade
     */
    private handleScroll(): void {
        if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(this.checkIfBottom, 200);
    }

    /**
     * @description Checks wether bottom of page hase been reached and  initiates fetching new posts
     * @author DerZade
     */
    private checkIfBottom(): void {
        if (this.loading) return;

        const wrapper: Vue = this.$refs.wrapper as Vue;

        if (!wrapper) return;

        const wrapperBottom: number = wrapper.$el.getBoundingClientRect().bottom;
        const bottomOfWindow: boolean = window.innerHeight + 100 > wrapperBottom;

        if (!bottomOfWindow) return;

        this.fetchBlogData();
    }
}
</script>


<style lang="scss" scoped>
.grad-blog-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grad-blog-wrapper + .grad-loader {
    margin-top: 30px;
}

.grad-blog__load-more {
    cursor: pointer;
    margin-top: 50px;
    font-size: 1.1em;
    font-weight: bold;
    opacity: 0.7;
    color: #D18D1F;

    &:hover {
        opacity: 1;
    }
}
</style>
