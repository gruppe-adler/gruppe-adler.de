<template>
    <header class="grad-header">
        <video autobuffer autoplay playsinline muted loop class="grad-header__video" :src="`${baseUrl}video/header/${video}`" aria-hidden="true"></video>
        <div class="grad-header__fade"></div>
        <img class="grad-header__logo" :src="`${baseUrl}logo.svg`" alt="Gruppe Adler Logo" />
    </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const DEFAULT_VIDEO = 'roadblock.mp4';

/* eslint-disable quote-props */
const videos: { [key: string]: string } = {
    'technik': 'repair.mp4',
    'ueber-uns': 'nightfall.mp4',
    'mitspielen': 'briefing_black_fix.mp4',
    'kontakt': 'ieds.mp4'
};
/* eslint-enable quote-props */

@Component
export default class TheHeaderVue extends Vue {
    private get video (): string {
        const routeParts = this.$route.path.split('/').filter(s => s.length > 0).map(s => s.toLowerCase());

        if (routeParts.length === 0) return DEFAULT_VIDEO;

        if (Object.prototype.hasOwnProperty.call(videos, routeParts[0])) {
            return videos[routeParts[0]];
        }

        return DEFAULT_VIDEO;
    }

    private get baseUrl (): string {
        return process.env.BASE_URL;
    }
}
</script>

<style lang="scss" scoped>
.grad-header {
    margin-top: 2.5rem;
    position: relative;
    z-index: 0;
    height: 28rem;
    width: 100%;
    overflow: hidden;
    min-height: 28rem;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000;

    &__fade {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(360deg, #000000 0%, rgba(51, 51, 51, 0) 50%);
    }

    &__video {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    &__logo {
        height: 10rem;
        position: absolute;
        top: 6rem;
        left: .5rem;
    }

    @media(max-width: 1150px) {
        height: 21.75rem;
        &__logo {
            display: none;
        }
    }
}
</style>
