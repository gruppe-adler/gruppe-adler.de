<template functional>
<div class="spinner">
    <svg viewBox="0 0 24 24">
        <circle class="" cx="12" cy="12" r="10"></circle>
    </svg>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'grad-spinner'
})
export default class Spinner extends Vue {}
</script>

<style lang="scss" scoped>
.spinner {
    color: #D18D1F;
    font-size: 100px;
    height: 1em;
    width: 1em;
    display: flex;

    > svg {
        animation: grad-spinner-rotate 2s linear infinite;
        height: 100%;
        width: 100%;
    }

    > svg > circle {
        animation: grad-spinner-bar-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 2.08%, 416%;
        stroke-dashoffset: 0;
        transition: stroke-dasharray 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        fill: none;
        stroke-dasharray: 0, 416%;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        stroke-miterlimit: 20;
        stroke-width: 0.125rem;
        stroke: currentColor;
    }

}
@keyframes grad-spinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes grad-spinner-bar-dash {
    0% {
        stroke-dasharray: 2.08%, 416%;
        stroke-dashoffset: 0%;
    }
    50% {
        stroke-dasharray: 185.4%, 416%;
        stroke-dashoffset: -72.9%;
    }
    to {
        stroke-dasharray: 185.4%, 416%;
        stroke-dashoffset: -258.33%;
    }
}
</style>

