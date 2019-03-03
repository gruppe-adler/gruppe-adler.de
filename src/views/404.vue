<template>
    <Content>
        <Error type="404">
            <div>Scheint so als ob du dich verlaufen hast.</div>
            <router-link class="grad-back " to="/" tag="a">
                Klick hier um zurück zum Anfang zu gelangen.
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
