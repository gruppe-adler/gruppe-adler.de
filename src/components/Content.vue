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
        padding: 5px;
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
@media (max-width: 1350px) {
    .grad-content__main {
        width: 600px;
    }
}
@media (max-width: 1150px) {
    .grad-content__main {
        width: 800px;
    }
    .grad-content__left,
    .grad-content__right {
        display: none;
    }
}
</style>

