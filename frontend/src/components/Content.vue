<template functional>
    <div class="grad-content">
        <aside v-if="$slots.left" class="grad-content__left">
            <slot name="left" />
        </aside>
        <main class="grad-content__main">
            <slot />
        </main>
        <aside v-if="$slots.right" class="grad-content__right">
            <slot name="right" />
        </aside>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ContentVue extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/color-macros.scss";

$offset: 6.5rem;

.grad-content {
    margin-top: -$offset;
    display: grid;
    grid-template: "left main right" auto / .5fr auto .5fr;
    padding-bottom: 6rem;

    &__main {
        flex: none;
        width: 50rem;
        align-items: center;
        display: flex;
        flex-direction: column;
        grid-area: main;
    }

    &__left,
    &__right {
        flex-grow: 0;
        margin: 2.5rem;
        margin-top: $offset + 2.5rem;
        color: $text-color-tertiary;
    }

    &__left {
        grid-area: left;
    }

    &__right {
        grid-area: right;
    }
}
@media (max-width: 1350px) {
    .grad-content__main {
        width: 37rem;
    }
}
@media (max-width: 1150px) {
    .grad-content {
        grid-template: "main" auto / 100%;
        justify-items: center;

        &__main {
            width: 50rem;
            max-width: calc(100% - 1.25rem);
        }
        &__left,
        &__right {
            display: none;
        }
    }
}
</style>
