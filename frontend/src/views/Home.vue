<template>
    <Content>
        <Events />
        <transition-group v-if="tweets.length > 0" name="grad-blog-entry--transition" tag="div" class="grad-blog-wrapper" ref="wrapper">
            <Tweet
                v-for="tweet in visibleTweets"
                :model="tweet"
                :key="`tweet-${tweet.id}`"
            />
        </transition-group>
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Tweets etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
        <Loader v-else-if="loading" />
        <a v-else-if="!nothingLeft" key="load-more" class="grad-blog__load-more" @click="loadMore">Mehr laden</a>
        <span v-else key="end" class="grad-blog__end">Sieht so aus als ob du am Anfang angekommen bist.</span>
        <template v-slot:right>
            <div class="grad-blog__social-media">
                <a
                    v-for="item in footerItems"
                    :href="item.url"
                    :key="item.url"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img v-lazy-img :data-src="`/img/footer/${item.image}.svg`" :alt="item.image" />
                </a>
            </div>
        </template>
    </Content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Tweet, fetchTweets } from '@/services/twitter';
import TweetVue from '@/components/Home/Tweet.vue';
import footerItems from '@/assets/footerItems';
import EventsVue from '@/components/Home/Events.vue';

@Component({
    components: {
        Tweet: TweetVue,
        Events: EventsVue
    }
})
export default class HomeVue extends Vue {
    private loadingError = false;
    private loading = true;
    private scrollTimeout: number|null = null;
    private scrollListenerAdded = false;
    private nothingLeft = false;
    private footerItems = footerItems;

    private tweets: Tweet[] = [];
    private visibleTweets: Tweet[] = [];

    private created () {
        this.fetchTweets();
    }

    private beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private async fetchTweets () {
        this.loading = true;

        // fetch tweets
        const oldestTweet: Tweet = this.tweets[this.tweets.length - 1];
        const oldestTweetId = oldestTweet && oldestTweet.id;
        let newTweets: Tweet[] = [];
        try {
            newTweets = await fetchTweets(oldestTweetId);
        } catch (err) {
            console.error(err);
            this.loadingError = true;
            this.loading = false;
            return;
        }
        this.tweets = [...this.tweets, ...newTweets];

        if (newTweets.length === 0) {
            this.nothingLeft = true;
        }

        this.loading = false;
    }

    /**
     * @description Click callback for "load more" button fetches more blogpost and adds scroll event listener
     * @author DerZade
     */
    private loadMore () {
        this.fetchTweets();

        if (this.scrollListenerAdded) return;

        this.scrollListenerAdded = true;

        window.addEventListener('scroll', this.handleScroll);
    }

    /**
     * @description Scroll event callback. Calls function to check wether bottom of page hase been reached via a timeout
     * @author DerZade
     */
    private handleScroll (): void {
        if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(this.checkIfBottom, 200);
    }

    /**
     * @description Checks wether bottom of page hase been reached and  initiates fetching new posts
     * @author DerZade
     */
    private checkIfBottom (): void {
        if (this.loading) return;
        if (this.nothingLeft) return;

        const wrapper: Vue = this.$refs.wrapper as Vue;

        if (!wrapper) return;

        const wrapperBottom: number = wrapper.$el.getBoundingClientRect().bottom;
        const bottomOfWindow: boolean = window.innerHeight + 100 > wrapperBottom;

        if (!bottomOfWindow) return;

        this.fetchTweets();
    }

    @Watch('tweets', { deep: true })
    @Watch('isLoggedIn')
    private updateVisibleTweets (): void {
        if (this.isLoggedIn) {
            this.visibleTweets = this.tweets;
        } else {
            this.visibleTweets = this.tweets.filter(x => !x.hidden);
        }
    }

    /**
     * @description Check if user is logged in
     * @author DerZade
     * @returns {boolean} User logged in?
     */
    private get isLoggedIn (): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.$root.isLoggedIn() || false;
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
    margin-top: 2rem;
}

.grad-blog__load-more,
.grad-blog__end {
    margin-top: 3rem;
    font-size: 1.1em;
    font-weight: bold;
    opacity: 0.7;
}

.grad-blog__load-more {
    cursor: pointer;
    color: #D18D1F;

    &:hover {
        opacity: 1;
    }
}

.grad-blog__end {
    color: black;
}

.grad-blog__social-media {
    display: inline-grid;
    margin-left: 3rem;
    flex-shrink: 1;
    max-width: 100%;
    overflow: hidden;

    > a {
        margin: 2rem 0;
        flex: none;
        color: black;
        cursor: pointer;
        opacity: 0.7;
        max-width: 100%;

        img {
            height: 4rem;
            max-width: 100%;
            filter: saturate(0%);
        }

        &:hover {
            opacity: 1;
            img {
                filter: saturate(100%);
            }
        }
    }
}
</style>
