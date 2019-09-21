<template functional>
    <div class="grad-action-buttons">
        <slot />
    </div>
</template>

<style lang="scss">
.grad-action-buttons {
    position: absolute;
    top: -60px;
    left: 0px;
    display: flex;
    width: 100%;

    > *:not(:last-child) {
        margin-right: 8px;
    }
}
</style>