<template>
    <Content>
        <Error type="404">
            <h3>Adler ausgeflogen.</h3>
            <router-link  to="/" tag="a">
                <button>Zurück zum Anfang</button>
            </router-link>
        </Error>
    </Content>
</template>

<style lang="scss" scoped>
.grad-back {
    color: #d18d1f;
    opacity: 0.9;

    &:hover {
        opacity: 1;
    }
}
</style>
