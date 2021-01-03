<template>
    <div class="grad-loader">
        <Container v-show="timeoutDone">
            <template v-slot:header>
                <div class="grad-loader__progress"></div>
                <span></span>
            </template>
            <template>
                <div style="height: 19rem;"></div>
            </template>
        </Container>
        <div v-if="!timeoutDone" style="height: 19rem;"></div>
        <div class="grad-loader__mask"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoaderVue extends Vue {
    private timeoutDone = false;
    private mounted () {
        // show loader only after 300ms to prevent "flashing" of
        // the loader for normal (< 300ms) loading times
        window.setTimeout(() => { this.timeoutDone = true; }, 300);
    }
}
</script>

<style lang="scss">
@import "@/assets/color-macros.scss";
.grad-loader {
    opacity: 1;
    width: 100%;
    position: relative;

    &__mask {
        left: -3rem;
        right: -3rem;
        height: 19rem;
        top: 12.5rem;
        position: absolute;
        background-image: linear-gradient(rgba($background-color, 0), $background-color, $background-color, $background-color);
    }

    &__progress {
        color: #D18D1F;
        height: 0.25rem;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        border-radius: inherit;

        &:before {
            background-color: currentColor;
            opacity: 0.4;
            content: '';
            display: block;;
            height: 100%;
            width: 100%;
            position: absolute;
        }

        &:after {
            background-color: currentColor;
            content: '';
            display: block;
            height: 100%;
            width: 100%;
            position: absolute;
            will-change: left, transform;
            left: 0px;
            transform: scaleX(1);
            animation: grad-loader-progress infinite 2s linear;
        }

    }
}

@keyframes grad-loader-progress {
    0% {
        transform: scaleX(0.1);
        left: - 100%;
    }
    50% {
        transform: scaleX(0.8);
        left: 20%;
    }
    100% {
        transform: scaleX(0.1);
        left: 100%;
    }
}
</style>
