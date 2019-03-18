<template functional>
<div class="grad-progress"></div>
</template>

<style lang="scss" scoped>
.grad-progress {
    color: #D18D1F;
    height: 5px;
    background-color: rgba(#D18D1F, 0.4);
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;

    &:after {
        background-color: currentColor;
        content: '';
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        animation: grad-progress infinite 2s linear;
    }

}
@keyframes grad-progress {
    0% {
        transform: scaleX(0.1);
        left: - 100%;
    }
    50% {
        transform: scaleX(0.8);
        left: 20%;
    }
    100% {
        transform: scaleX(0.1);
        left: 100%;
    }
}

</style>

