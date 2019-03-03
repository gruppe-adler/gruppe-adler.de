<template>
    <BlogEntry headerColor="#1DA1F2" class="grad-tweet">
        <template v-slot:date>{{date}}</template>
        <template v-slot:heading><a target="_blank" :href="`https://twitter.com/${model.author.username}`">@{{model.author.username}}</a></template>
        <template v-slot:tags><span>Twitter</span></template>
        <template v-slot:author><a target="_blank" :href="`https://twitter.com/${model.author.username}`"><img :src="model.author.picture" /></a></template>
        <template>
            <div class="grad-tweet__media" v-if="model.media.length > 0">
                <a 
                    v-for="m in model.media"
                    :key="m.id"
                    :href="m.target"
                    target="_blank"
                >
                    <img :src="m.url" />
                </a>
            </div>
            <p v-if="isRetweet" class="grad-tweet__retweet-author">
                Retweet von <a :href="`https://twitter.com/${model.retweetedTweet.author.username}`">@{{model.retweetedTweet.author.username}}</a>    
            </p>
            <p v-html="model.caption"></p>
        </template>
        <template v-if="isRetweet" v-slot:footer>
            <svg width="26" height="15" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" d="M14.4141 14.2012C14.8438 12.4238 15.5469 10.1973 16.5234 7.52148C17.5195 4.82617 18.5352 2.375 19.5703 0.167969H25.9863C24.6973 5.38281 23.7109 10.2754 23.0273 14.8457H14.8242L14.4141 14.2012ZM0.732422 14.2012C1.16211 12.4238 1.86523 10.1973 2.8418 7.52148C3.83789 4.82617 4.85352 2.375 5.88867 0.167969H12.3047C11.0156 5.38281 10.0293 10.2754 9.3457 14.8457H1.14258L0.732422 14.2012Z" fill="black"/>
            </svg>
            <div class="grad-tweet__media" v-if="model.retweetedTweet.media.length > 0">
                <a 
                    v-for="m in model.retweetedTweet.media"
                    :key="m.id"
                    :href="m.target"
                    target="_blank"
                >
                    <img :src="m.url" />
                </a>
            </div>
            <div>
                <p class="grad-tweet__retweet-author">
                    {{model.retweetedTweet.author.displayName}}
                </p>
                <p v-html="model.retweetedTweet.caption"></p>
            </div>
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
.grad-tweet {

    &__media {
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex; 
        justify-content: space-evenly;
        overflow: hidden;

        img {
            overflow: hidden;
            max-width: none;
            flex: none;
        }

        > a {
            overflow: hidden;
            width: auto;
            display: flex;
            justify-content: center;

            &:not(:last-child) {
                margin-right: 2px;
            }
        }
    }

    &__retweet-author {
        font-weight: bold;
    }

    .grad-container__content,
    .grad-container__footer {
        a {
            color: #1DA1F2;
            text-decoration: none;
            font-weight: bold;
        }
    }

    .grad-container__header {
        color: white;
        background-image: url('~@/assets/blog/twitter.png');
        background-repeat: no-repeat;
        background-position: center;
    }

    .grad-container__content {
        margin-top: 18px;

        .grad-tweet__media img {
            max-height: 250px;
        }

    }

    .grad-container__footer {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 60px;
        height: auto;
        display: flex;
        position: relative;
        line-height: 2em;

        > svg {
            position: absolute;
            left: 20px;
            top: 20px;
        }

        .grad-tweet__media {
            max-width: 150px;
            margin-right: 20px;
            margin-bottom: 0px;
            flex: none;

            img {
                max-height: 80px;
            }
        }
    }
}

// show text of retweet below the media
@media (max-width: 650px) {
    .grad-tweet {
        .grad-container__header {
            background-image: none;
        }

        .grad-container__footer {
            flex-direction: column;

            .grad-tweet__media {
                width: auto;
                max-width: 100%;
                margin-right: 0px;
            }
        }
    }
}
</style>
