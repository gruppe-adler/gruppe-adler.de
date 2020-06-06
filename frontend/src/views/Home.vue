<template>
    <Content>
        <transition-group name="grad-blog-entry--transition" tag="div" class="grad-blog-wrapper" ref="wrapper">
            <Tweet
                v-for="tweet in tweets"
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
    </Content>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tweet, fetchTweets } from '@/services/twitter';
import TweetVue from '@/components/Home/Tweet.vue';

@Component({
    components: {
        Tweet: TweetVue
    }
})
export default class HomeVue extends Vue {
    private loadingError = false;
    private loading = true;
    private scrollTimeout: number|null = null;
    private scrollListenerAdded = false;
    private nothingLeft = false;

    private tweets: Tweet[] = [];

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

.grad-blog__load-more,
.grad-blog__end {
    margin-top: 50px;
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
</style>

<style lang="scss">
.grad-blog-entry--transition-enter-active,
.grad-blog-entry--transition-leave-active {
    transition: all 0.25s !important;
    max-height: 1000px !important;
    opacity: 1 !important;
}

.grad-blog-entry--transition-enter,
.grad-blog-entry--transition-leave-to {
    max-height: 0px !important;
    opacity: 0 !important;
}
</style>
