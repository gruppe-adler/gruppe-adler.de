<template>
    <BlogEntry headerColor="transparent" class="grad-tweet">
        <template v-slot:date>{{date}}</template>
        <template v-slot:heading><a :href="`https://twitter.com/${model.author.username}`" target="_blank" rel="noreferrer">@{{model.author.username}}</a></template>
        <template v-slot:author>
            <a :href="`https://twitter.com/${model.author.username}`" target="_blank" rel="noreferrer">
                <img v-lazy-img :data-src="model.author.picture" alt="avatar" :height="2.25 *16" :width="2.25 *16" />
            </a>
        </template>
        <template>
            <div class="grad-tweet__media" v-if="model.media.length > 0">
                <a
                    v-for="m in model.media"
                    :key="m.id"
                    :href="m.target"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img v-lazy-img :data-src="m.url" alt="twitter-media" :height="16 *16" :width="48 *16" />
                </a>
            </div>
            <p v-if="isRetweet" class="grad-tweet__retweet-author">
                Retweet von <a :href="`https://twitter.com/${model.retweetedTweet.author.username}`" target="_blank" rel="noreferrer">@{{model.retweetedTweet.author.displayName}}</a>
            </p>
            <p v-html="model.caption"></p>
            <template v-if="isLoggedIn">
                <div v-if="model.hidden" class="grad-tweet__overlay">
                    <i class="material-icons">visibility_off</i>
                </div>
                <div class="grad-tweet__actions">
                    <ActionButton
                        v-if="model.hidden"
                        tooltip="Tweet anzeigen"
                        icon="visibility"
                        @click="toggleVisibility"
                    />
                    <ActionButton
                        v-else
                        tooltip="Tweet verstecken"
                        icon="visibility_off"
                        @click="toggleVisibility"
                    />
                </div>
            </template>
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
                    rel="noreferrer"
                >
                    <img v-lazy-img :data-src="m.url" alt="twitter-media" :height="5 * 16" :width="10 * 16" />
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
import { Tweet, RETWEET_TYPE, hideTweet } from '@/services/twitter';
import BlogEntryVue, { parseDate } from './BlogEntry.vue';
import ActionButtonVue from '../ActionButton.vue';

@Component({
    components: { BlogEntry: BlogEntryVue, ActionButton: ActionButtonVue }
})
export default class TweetVue extends Vue {
    @Prop() private model?: Tweet;

    private get isRetweet (): boolean {
        if (!this.model) return false;

        return this.model.type === RETWEET_TYPE;
    }

    private get date (): string {
        if (!this.model) return '';

        return parseDate(this.model.date);
    }

    private async toggleVisibility () {
        if (!this.model) return;

        await hideTweet(this.model.id, !this.model.hidden);

        this.model.hidden = !this.model.hidden;
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
<style lang="scss">
.grad-tweet {
    &__media {
        border-radius: .5rem;
        margin-bottom: .5rem;
        display: flex;
        justify-content: space-evenly;
        overflow: hidden;

        > a {
            overflow: hidden;
            width: auto;
            display: flex;
            justify-content: center;

            &:not(:last-child) {
                margin-right: .125rem;
            }

            &:only-child {
                border-radius: inherit;
            }

            > img {
                overflow: hidden;
                max-width: none;
                flex: none;
            }
        }
    }

    &__overlay {
        background-color: rgba(black, 0.5);
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 30;
        border-radius: 0.25rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(white, 0.75);
        cursor: default;
        transition: opacity 0.1s ease-in-out;

        &:hover {
            opacity: 0.3;
        }

        > i {
            font-size: 3rem
        }
    }

    &__actions {
        position: absolute;
        top: 0px;
        left: calc(100% + 0.5rem);
        bottom: 0px;
        width: auto !important;
    }

    &__retweet-author {
        font-weight: bold;
    }

    .grad-container__content,
    .grad-container__footer {
        a {
            color: #1DA1F2;
            font-weight: bold;
        }
    }

    .grad-container__header {
        color: rgba(0, 0, 0, 0.5);
        background-image: url('~@/assets/twitter.svg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 3%;
    }

    .grad-container__content .grad-tweet__media img {
        background-color: #EEE;
        max-height: 16rem;
        width: auto;
    }

    .grad-container__footer {
        padding-left: 3.75rem;
        display: flex;
        position: relative;
        line-height: 2em;

        > svg {
            position: absolute;
            left: 1.25rem;
            top: 1.25rem;
        }

        .grad-tweet__media {
            max-width: 10rem;
            margin-right: 1.25rem;
            margin-bottom: 0;
            flex: none;
            width: auto;

            img {
                max-height: 5rem;
                width: auto;
                background-color: #EEE;
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
                margin-right: 0;
            }
        }
    }
}
</style>
