<template functional>
    <section class="grad-error">
        <img class="grad-error__image" v-if="props.type === '404'" src="@/assets/error/404.svg" alt="" />
        <img class="grad-error__image" v-else src="@/assets/error/generic.svg" alt="" />
        <div class="grad-error__text">
            <slot v-if="$slots.default"></slot>
            <template v-else>Scheint so, als ob etwas schief gelaufen ist.</template>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ErrorVue extends Vue {}
</script>

<style lang="scss" scoped>
.grad-error {
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 1;
    &__image {
        height: 20rem;
    }

    &__text {
        font-family: 'Oswald', sans-serif;
        font-size: 1.25rem;
        text-align: center;
        margin-top: -1.25rem;
    }

}
</style>
