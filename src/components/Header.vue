<template>
    <header class="grad-header">
        <picture class="grad-header__logo"  alt="logo">
            <img class="grad-header__logo" src="@/assets/logo192.svg" alt="logo" />
        </picture>
    </header>
</template>

<script>
import './Header/modernizr-webp.js';

export default {};
</script>

<style lang="scss" scoped>
.grad-header {
    margin-top: 40px;
    position: relative;
    z-index: 0;
    background-color: transparent;
    background: linear-gradient(360deg, #000000 0%, rgba(51, 51, 51, 0) 50%), url('~@/assets/header.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    
    height: 450px;
    

    &__image {
        max-width: 100%;
    }

    &__logo {
        height: 162px;
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

.no-webp .grad-header {
    background: linear-gradient(360deg, #000000 0%, rgba(51, 51, 51, 0) 50%), url('~@/assets/header.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>

