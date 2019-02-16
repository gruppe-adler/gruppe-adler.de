<template functional>
    <div class="grad-error">
        <img class="grad-error__image" v-if="props.type === '404'" src="@/assets/error/404.png" alt="error-image" />
        <img class="grad-error__image" v-else src="@/assets/error/generic.png" alt="error-image" />
        <div class="grad-error__text">
            <slot v-if="$slots.default"></slot>
            <template v-else>Scheint so als ob etwas schief gelaufen ist.</template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grad-error {
    display: flex;
    align-items: center;
    flex-direction: column;
    &__image {
        max-height: 220px;
    }

    &__text {
        font-family: 'Oswald', sans-serif;
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
    }

}
</style>
