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
    },
    metaInfo: {
        title: 'Gruppe Adler'
    }
})
export default class AppVue extends Vue {
    private mounted () {
        this.makeOverscrollPretty();
    }

    private makeOverscrollPretty () {
        let animFrame: number;
        let isTop = true;

        const updateColor = () => {
            if (animFrame !== undefined) window.cancelAnimationFrame(animFrame);
            const color = isTop ? '#000000' : '';

            animFrame = window.requestAnimationFrame(() => {
                document.body.style.backgroundColor = color;
                document.documentElement.style.backgroundColor = color;
            });
        };

        updateColor();

        document.addEventListener('scroll', () => {
            const top = (window.scrollY < 600);

            if (top === isTop) return;

            isTop = top;
            updateColor();
        });
    }
}
</script>

<style lang="scss">
@import '~@/assets/global.scss';

// make the page min height 100vh
#app > .grad-header + *  {
    min-height: calc(100vh - 25rem);
}
</style>
