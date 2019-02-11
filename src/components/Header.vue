<template>
    <header class="grad-header">
        <img class="grad-header__logo" src="/logo512.png" />
    </header>
</template>

<style lang="scss" scoped>
.grad-header {
    margin-top: 40px;
    position: relative;
    z-index: 0;
    background-color: transparent;
    background: linear-gradient(360deg, #000000 0%, rgba(51, 51, 51, 0) 50%),  url('~@/assets/image2.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    
    height: 450px;
    

    &__image {
        max-width: 100%;
    }

    &__logo {
        max-height: 162px;
        position: absolute;
        top: 100px;
        left: 10px;
    }

    @media(max-width: 1150px) {
        height: 350px;
        &__logo {
            display: none;
        }
    }
}
</style>

