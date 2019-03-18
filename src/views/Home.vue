<template>
<div>
    <Content>
        <template v-if="blogEntries.length > 0">
            <transition-group name="grad-blog-entry--transition" tag="div" class="grad-blog-wrapper">
                <template v-for="entry in blogEntries">
                    <BlogPost 
                        v-if="isBlogPost(entry)"
                        :model="entry"
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
        <template v-else>
            <Error v-if="loadingError">
                Scheint so als ob beim Laden der Blogposts etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
            </Error>
            <Loader v-else />
        </template>
    </Content>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import BlogPostVue from '@/components/Blog/BlogPost.vue';
import TweetVue from '@/components/Blog/Tweet.vue';

import { BlogEntry } from '@/models/blog/BlogEntry';
import { BlogPost, BLOG_POST_TYPE } from '@/models/blog/BlogPost';
import { Tweet } from '@/models/blog/Tweet';
import { EVENT_REPORT_TYPE } from '@/models/blog/BlogPostEvent';
import { MOD_UPDATE_TYPE } from '@/models/blog/BlogPostModset';

import ApiService from '@/ApiService';

@Component({
    components: { BlogPost: BlogPostVue, Tweet: TweetVue }
})
export default class HomeVue extends Vue {
    private loadingError: boolean = false;
    private tweets: Tweet[] = [];
    private blogPosts: BlogPost[] = [];
    private blogEntries: BlogEntry[] = [];

    private mounted() {
        this.fetchBlogData();
    }

    private async fetchBlogData() {
        this.blogPosts = [];
        this.tweets = [];
        this.loadingError = false;

        try {
            this.blogPosts = await ApiService.getBlogPosts();
        } catch (err) {
            console.error(err);
            this.loadingError = true;
            return;
        }

        try {
            this.tweets = await ApiService.getTweets();
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }

        this.updateBlogEntries();
    }

    @Watch('$route')
    private routeChanged(to: Route, from: Route) {
        if (to.path === from.path) return;

        this.updateBlogEntries();
    }

    private updateBlogEntries() {
        let arr: BlogEntry[] = [];
        const path = this.$route.path.replace(/^\/home/i, '');

        if (path === '/alles') {
            arr = arr.concat(this.blogPosts).concat(this.tweets);
        } else if (path === '/tweets') {
            arr = this.tweets;
        } else {
            // @ts-ignore
            const filteredType = {
                '/allgemeines': BLOG_POST_TYPE,
                '/events': EVENT_REPORT_TYPE,
                '/modset': MOD_UPDATE_TYPE
            }[path.toLowerCase()];

            if (!filteredType) {
                console.log(path.toLowerCase());
                this.blogEntries = [];
                return;
            }

            arr = this.blogPosts.filter(x => x.type === filteredType);
        }

        // set sorted arr as entries
        this.blogEntries = arr.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    private isBlogPost(entry: BlogEntry): boolean {
        return [BLOG_POST_TYPE, EVENT_REPORT_TYPE, MOD_UPDATE_TYPE].includes(entry.type);
    }
}
</script>


<style lang="scss" scoped>
.grad-blog-wrapper {
    width: 100%;
}
</style>
