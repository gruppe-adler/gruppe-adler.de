<template>
    <div class="grad-loader">
        <Container v-show="timeoutDone">
            <template v-slot:header>
                <Progress />
                <span></span>
            </template>
            <template>
                <div style="height: 300px;"></div>
            </template>
        </Container>
        <div class="grad-loader__mask"></div>
    </div>
</template>

<script lang="ts">
import Progress from '@/components/Loader/Progress.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: { Progress }
})
export default class LoaderVue extends Vue {
    private timeoutDone = false;
    private mounted () {
        // show loader only after 200ms to prevent "flashing" of
        // the loader for normal (< 200ms) loading times
        window.setTimeout(() => { this.timeoutDone = true; }, 200);
    }
}
</script>

<style lang="scss" scoped>
.grad-loader {
    opacity: 1;
    width: 100%;
    position: relative;

    &__mask {
        left: -50px;
        right: -50px;
        height: 300px;
        top: 200px;
        position: absolute;
        background-image: linear-gradient(transparent, #F0EEEC, #F0EEEC, #F0EEEC);
    }
}
</style>
