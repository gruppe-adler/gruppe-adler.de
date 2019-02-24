<template>
    <BlogEntry headerColor="#1DA1F2" class="grad-blog--tweet">
        <template v-slot:date>{{date}}</template>
        <template v-slot:heading>@{{model.author.username}}</template>
        <template v-slot:tags><span>Twitter</span></template>
        <template v-slot:author><img :src="model.author.picture" /></template>
        <template>
            <p v-if="isRetweet" class="grad-blog-entry__retweet-author">
                Retweet von <a :href="`https://twitter.com/${model.retweetedTweet.author.username}`">@{{model.retweetedTweet.author.username}}</a>    
            </p>
            <p v-html="model.caption"></p>
        </template>
        <template v-if="isRetweet" v-slot:footer>
            <svg width="26" height="15" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" d="M14.4141 14.2012C14.8438 12.4238 15.5469 10.1973 16.5234 7.52148C17.5195 4.82617 18.5352 2.375 19.5703 0.167969H25.9863C24.6973 5.38281 23.7109 10.2754 23.0273 14.8457H14.8242L14.4141 14.2012ZM0.732422 14.2012C1.16211 12.4238 1.86523 10.1973 2.8418 7.52148C3.83789 4.82617 4.85352 2.375 5.88867 0.167969H12.3047C11.0156 5.38281 10.0293 10.2754 9.3457 14.8457H1.14258L0.732422 14.2012Z" fill="black"/>
            </svg>
            <p class="grad-blog-entry__retweet-author">{{model.retweetedTweet.author.displayName}}</p>
            <!-- <span>({{model.retweetedTweet.author.username}})</span> -->
            <!-- <span>{{model.retweetedTweet.date}}</span> -->
            <p v-html="model.retweetedTweet.caption"></p>
        </template>
    </BlogEntry>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Tweet, RETWEET_TYPE } from '@/models/blog/Tweet';
import BlogEntryVue, {parseDate} from './BlogEntry.vue';

@Component({
    components: { BlogEntry: BlogEntryVue }
})
export default class TweetVue extends Vue {
    @Prop() private model?: Tweet;

    private get isRetweet(): boolean {
        if (!this.model) return false;

        return this.model.type === RETWEET_TYPE;
    }

    private get date(): string {
        if (!this.model) return '';

        return parseDate(this.model.date);
    }
}
</script>
<style lang="scss">
.grad-blog--tweet {
    .grad-container__header {
        color: white;
        background-image: url('~@/assets/blog/twitter.png');
        background-repeat: no-repeat;
        background-position: center;
    }

    a {
        color: #1DA1F2;
        text-decoration: none;
        font-weight: bold;
    }

    .grad-container__content {
        margin-top: 18px;
    }

    .grad-container__footer {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 60px;
        height: auto;
        display: block;
        position: relative;
        line-height: 2em;

        > svg {
            position: absolute;
            left: 20px;
            top: 20px;
        }
    }
}
.grad-blog-entry__retweet-author {
    font-weight: bold;
}
</style>
