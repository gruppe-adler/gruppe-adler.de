<template>
    <div class="grad-page__loader">
        <Container> 
            <template v-slot:header>
                <Progress />
                <span></span>
            </template>
            <template>
                <div style="height: 300px;"></div>
            </template>
        </Container>
        <div class="grad-page__loader-mask"></div>
    </div>
</template>

<script lang="ts">
import Progress from '@/components/LoadingIndicator/Progress.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: { Progress }
})
export default class LoadingIndicator extends Vue {}
</script>


<style lang="scss" scoped>
.grad-page__loader {
    opacity: 1;
    width: 100%;

    &-mask {
        width: calc(100% + 100px);
        height: 300px;
        position: relative;
        top: -250px;
        left: -50px;
        background-image: linear-gradient(transparent, #F0EEEC, #F0EEEC, #F0EEEC);
    }
}
</style>
