<template>
    <div id="app">
        <Navbar />
        <img class="grad-background-image" src="./assets/image.jpg">

        <router-view/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';

@Component({
    components: {
        Navbar
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('~@/global.scss');

</style>
