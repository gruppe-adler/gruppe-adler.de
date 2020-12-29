<template>
    <grad-navbar
        @gradpathchanged="onPathChanged"
        :active-path="$route.path"
        :nav-style="navCollapsed ? 'transition: transform .25s ease-in-out; transform: translateY(-100%);' : 'transition: transform .25s ease-in-out;'"
    ></grad-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { GradNavbar, GradPathChangedEvent } from '@gruppe-adler/navbar-component';

customElements.define('grad-navbar', GradNavbar);

@Component({
    metaInfo () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.metaInfoMethod();
    }
})
export default class TheNavbarVue extends Vue {
    private activeDisplayName = '';
    private pageYOffset = 0; // for hiding nav bar when scrolling
    private navCollapsed = false; // for hiding nav bar when scrolling

    private created () {
        window.addEventListener('scroll', this.handleScroll);
    }

    private beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private onPathChanged (event: GradPathChangedEvent) {
        if (event.gradPath !== this.$route.path) {
            this.$router.push(event.gradPath);
        }

        this.activeDisplayName = event.gradDisplayName;
        event.preventDefault();
    }

    private metaInfoMethod () {
        if (this.activeDisplayName.length > 0) {
            return {
                title: this.activeDisplayName,
                titleTemplate: '%s - Gruppe Adler'
            };
        }

        return {};
    }

    /**
     * @description Window scroll handler callback. Hides navbar when user is scrolled down
     * @author DerZade
     */
    private handleScroll () {
        if (pageYOffset > this.pageYOffset) {
            // user scrolled down
            if (pageYOffset > 80) {
                this.navCollapsed = true;
                document.body.classList.add('grad-nav-collapsed');
            }
        } else {
            // user scrolled up
            this.navCollapsed = false;
            document.body.classList.remove('grad-nav-collapsed');
        }
        this.pageYOffset = pageYOffset;
    }
}
</script>
<style lang="scss" scoped>
body.grad-nav-collapsed grad-navbar {
    background-color: red;
}
</style>
