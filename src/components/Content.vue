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

<style lang="scss" scoped>
$offset: 200px;

.grad-content {
    margin-top: -$offset;
    display: grid;
    grid-template-columns: 0.5fr auto 0.5fr;
    margin-bottom: 100px;
    position: relative;

    &__main {
        flex: none;
        width: 800px;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    
    &__left,
    &__right {
        flex-grow: 0;
        margin: 40px;
        margin-top: $offset + 40px;
        color: rgba(0, 0, 0, 0.5);
    }
}
@media (max-width: 1350px) {
    .grad-content__main {
        width: 600px;
    }
}
@media (max-width: 1150px) {
    .grad-content {
        display: flex;
        justify-content: center;
        &__main {
            width: 800px;
            max-width: calc(100% - 20px);
        }
        &__left,
        &__right {
            display: none;
        }
    }
}
</style>

