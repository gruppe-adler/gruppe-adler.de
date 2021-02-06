<template>
    <Content>
        <template>
            <section class="grad-blog__intro">
                Wir sind ein deutscher Arma 3 Clan und spielen Milsim Coop sowie taktische TvT Missionen mit Mods wie ACE, TFAR und RHS.
                <router-link to="/ueber-uns">
                    <span class="material-icons" aria-hidden="true">arrow_forward</span>
                    <span>Mehr lesen</span>
                </router-link>
            </section>
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
            <a v-else-if="!nothingLeft" class="grad-blog__load-more" @click="loadMore">Mehr laden</a>
            <span v-else class="grad-blog__end">Sieht so aus als ob du am Anfang angekommen bist.</span>
        </template>
        <template v-slot:right>
            <div class="grad-blog__social-media">
                <a
                    v-for="item in footerItems"
                    :href="item.url"
                    :key="item.url"
                    target="_blank"
                    rel="noreferrer"
                >
                    <picture v-lazy-img :data-alt="item.name">
                        <source :srcset="`/img/footer/dark/${item.image}.svg`" media="(prefers-color-scheme: dark)">
                        <source :srcset="`/img/footer/${item.image}.svg`">
                    </picture>
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
    },
    metaInfo: {
        title: 'Gruppe Adler: Deutscher Arma 3 COOP & TvT Clan',
        meta: [
            { name: 'description', content: 'Gruppe Adler ist ein deutscher Arma 3 Clan. Die Community spezialisiert sich auf Milsim Coop und taktische TvT Missionen mit Mods wie ACE, TFAR und RHS.' }
        ]
    }
})
export default class HomeVue extends Vue {
    private loadingError = false;
    private loading = true;
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
        const oldestTweetId: string|undefined = oldestTweet && oldestTweet.id;
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
     * @description Checks wether bottom of page hase been reached and initiates fetching new posts
     * @author DerZade
     */
    private handleScroll (): void {
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
@import "@/assets/color-macros.scss";

.grad-blog__intro {
    z-index: 1;
    color: rgba(255, 255, 255, 0.8);
    padding: .25rem;
    text-shadow: 0 0.15rem 0.5rem rgba(0, 0, 0, .5);
    font-size: 1.3rem;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    border-radius: .25rem;
    margin-bottom: 1rem;
    margin-top: -4rem;

    a {
        color: $action-color;
        margin-left: .5em;
        font-size: 1rem;
        line-height: 1.7em;
        float: right;
        display: flex;
        justify-content: center;
        vertical-align: middle;

        &:hover {
            color: $action-color-hover;
        }

        > .material-icons {
            font-size: 1.2em;
            line-height: 1.5em;
            margin-right: .125rem;
        }
    }
}

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
    text-align: center;
}

.grad-blog__load-more {
    cursor: pointer;
    color: #D18D1F;

    &:hover {
        opacity: 1;
    }
}

.grad-blog__end {
    color: $text-color-primary;
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

        picture {
            width: auto;
            filter: saturate(0%);
            height: 4rem;

            > img {
                height: inherit;
            }
        }

        &:hover {
            opacity: 1;
            picture {
                filter: saturate(100%);
            }
        }
    }
}
</style>
