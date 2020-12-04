<template>
    <a
        :href="model.target"
        target="_blank"
        rel="noreferrer"
    >
        <img v-lazy-img alt="twitter-media" :height="height" :width="width" :data-srcset="srcSet" :data-src="url()" />
    </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { TweetMedia } from '@/services/twitter';

@Component
export default class TweetMediaVue extends Vue {
    @Prop({ required: true }) private model!: TweetMedia;
    @Prop({ type: Number, default: 48 * 16 }) private width!: number;
    @Prop({ type: Number, default: 16 * 16 }) private height!: number;

    private url (name?: string): string {
        const url = new URL(this.model.url);

        if (name !== undefined) {
            url.searchParams.set('name', name);
        }

        return url.toString();
    }

    private get srcSet (): string {
        return this.model.sizes.sort((a, b) => b.w - a.w).map(s => `${this.url(s.name)} ${s.w}w`).join(', ');
    }

    private get largestSize (): { name?: string, w: number, h: number } {
        if (this.model.sizes.length === 0) {
            return {
                name: undefined,
                w: 512,
                h: 256
            };
        }

        return this.model.sizes.sort((a, b) => b.w - a.w)[0];
    }
}
</script>

<style lang="scss" scoped>
a {
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
}

img {
    max-width: none;
    width: auto;
    background-color: #eee;
}
</style>
