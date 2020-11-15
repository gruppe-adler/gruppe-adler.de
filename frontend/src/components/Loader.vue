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

<style lang="scss" scoped>
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
        background-image: linear-gradient(transparent, #F0EEEC, #F0EEEC, #F0EEEC);
    }

    &__progress {
        color: #D18D1F;
        height: 0.25rem;
        background-color: rgba(#D18D1F, 0.4);
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        border-radius: inherit;

        &:after {
            background-color: currentColor;
            content: '';
            display: block;
            height: 100%;
            width: 100%;
            position: absolute;
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
