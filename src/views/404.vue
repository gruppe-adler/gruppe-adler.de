<template>
    <Content>
        <Error type="404">
            <h3>Leider ausgeflogen.</h3>
            <div class="subline">Seite existiert nicht.</div><br/>
            <router-link  to="/" tag="a">
                <button class="grad-back">Zurück zum Anfang</button>
            </router-link>
        </Error>
    </Content>
</template>

<style lang="scss" scoped>
.grad-back {
    background-color: rgba(255,255,255,0);
}
.grad-back:hover {
    background-color: #2F80ED;
}
.subline {
    font-size: 16px;
    font-family: "Source Sans Pro";
    color: #666;
}
</style>
