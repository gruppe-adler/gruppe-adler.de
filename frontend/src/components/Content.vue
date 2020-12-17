<template functional>
    <div class="grad-content">
        <aside class="grad-content__left">
            <slot name="left" />
        </aside>
        <main class="grad-content__main">
            <slot />
        </main>
        <aside class="grad-content__right">
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
$offset: 6.5rem;

.grad-content {
    margin-top: -$offset;
    display: grid;
    grid-template-columns: 0.5fr auto 0.5fr;
    padding-bottom: 6rem;
    position: relative;

    &__main {
        flex: none;
        width: 50rem;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    &__left,
    &__right {
        flex-grow: 0;
        margin: 2.5rem;
        margin-top: $offset + 2.5rem;
        color: rgba(0, 0, 0, 0.5);
    }
}
@media (max-width: 1350px) {
    .grad-content__main {
        width: 37rem;
    }
}
@media (max-width: 1150px) {
    .grad-content {
        grid-template-columns: 100%;
        justify-items: center;
        overflow-x: hidden;
        overflow-y: hidden;

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
