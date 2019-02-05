<template>
    <div id="app">
        <Navbar />
        <Header />

        <router-view/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';

@Component({
    components: {
        Navbar,
        Header
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('~@/global.scss');

</style>
