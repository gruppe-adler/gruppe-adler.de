<template>
    <div id="app">
        <Navbar />
        <Header />
        <router-view/>
        <Footer />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/TheNavbar.vue';
import Header from '@/components/TheHeader.vue';
import Footer from '@/components/TheFooter.vue';

@Component({
    components: {
        Navbar,
        Header,
        Footer
    }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('~@/global.scss');

// make the page min height 100vh
#app > .grad-header + *  {
    min-height: calc(100vh - 400px);
}

</style>
