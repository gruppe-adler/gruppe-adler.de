<template>
    <header class="grad-header">
        <video video autobuffer autoplay muted loop class="grad-header__video" :src="`${baseUrl}video/header/${video}`"></video>
        <div class="grad-header__fade"></div>
        <img class="grad-header__logo" :src="`${baseUrl}logo.svg`" alt="logo" />
    </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const DEFAULT_VIDEO = 'default.webm';

/* eslint-disable quote-props */
const videos: { [key: string]: string } = {
    'technik': 'technik.mp4'
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
    margin-top: 40px;
    position: relative;
    z-index: 0;
    background-color: transparent;
    height: 450px;
    width: 100%;
    overflow: hidden;
    min-height: 450px;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &__fade {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background: linear-gradient(360deg, #000000 0%, rgba(51, 51, 51, 0) 50%);
    }

    &__video {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    &__image {
        max-width: 100%;
    }

    &__logo {
        height: 162px;
        position: absolute;
        top: 100px;
        left: 10px;
    }

    @media(max-width: 1150px) {
        height: 350px;
        &__logo {
            display: none;
        }
    }
}
</style>
