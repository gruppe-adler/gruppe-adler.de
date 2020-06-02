<template>
    <div id="app">
        <TheNavbar />
        <TheHeader />
        <router-view/>
        <TheFooter />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNavbarVue from '@/components/TheNavbar.vue';
import TheHeaderVue from '@/components/TheHeader.vue';
import TheFooterVue from '@/components/TheFooter.vue';

@Component({
    components: {
        TheNavbar: TheNavbarVue,
        TheHeader: TheHeaderVue,
        TheFooter: TheFooterVue
    }
})
export default class AppVue extends Vue {}
</script>

<style lang="scss">
@import url('~@/assets/global.scss');

// make the page min height 100vh
#app > .grad-header + *  {
    min-height: calc(100vh - 400px);
}

</style>
