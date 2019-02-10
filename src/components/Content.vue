<template>
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
    display: flex;
    justify-content: center;
    margin-bottom: 100px;

    &__main {
        z-index: 0;
        width: 800px;
        max-width: 100%;
        align-items: center;
        display: flex;
        flex-direction: column;
    }
    
    &__left,
    &__right {
        flex-grow: 1;
        margin: 40px;
        margin-top: $offset + 40px;
        color: rgba(0, 0, 0, 0.5);
    }
}
</style>

