<template>
<div>
    <Content>
        <template v-if="blogEntries.length > 0">
            <template v-for="(entry, index) in blogEntries">
                <BlogPost 
                    v-if="isBlogPost(entry)"
                    :model="entry"
                    :key="index"
                />
                <Tweet
                    v-else
                    :model="entry"
                    :key="index"
                />
            </template>
        </template>
        <template v-else>
            <Error v-if="loadingError">
                Scheint so als ob beim Laden der Blogposts etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
            </Error>
            <LoadingIndicator v-else />
        </template>
    </Content>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import BlogPostVue from '@/components/Blog/BlogPost.vue';
import TweetVue from '@/components/Blog/Tweet.vue';

import { BlogEntry } from '@/models/blog/BlogEntry';
import { BlogPost, BLOG_POST_TYPE } from '@/models/blog/BlogPost';
import { Tweet } from '@/models/blog/Tweet';
import { EVENT_REPORT_TYPE } from '@/models/blog/EventReport';
import { MOD_PACK_UPDATE_TYPE } from '@/models/blog/ModpackUpdate';

import ApiService from '@/ApiService';

@Component({
    components: { LoadingIndicator, BlogPost: BlogPostVue, Tweet: TweetVue }
})
export default class HomeVue extends Vue {
    private loadingError: boolean = false;
    private tweets: Tweet[] = [];
    private blogPosts: BlogPost[] = [];

    private mounted() {
        this.fetchBlogData();
    }

    private async fetchBlogData() {
        this.tweets = [];
        this.blogPosts = [];
        this.loadingError = false;

        try {
            this.tweets = await ApiService.getTweets();
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }

        try {
            this.blogPosts = await ApiService.getBlogPosts();
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }
    }

    private get blogEntries(): BlogEntry[] {
        let arr: BlogEntry[] = [];
        arr = arr.concat(this.blogPosts).concat(this.tweets);
        return arr.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    private isBlogPost(entry: BlogEntry): boolean {
        return (entry.type in [BLOG_POST_TYPE, EVENT_REPORT_TYPE, MOD_PACK_UPDATE_TYPE]);
    }
}
</script>

