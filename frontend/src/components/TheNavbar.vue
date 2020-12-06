<template>
    <nav class="grad-nav" :style="navShown ? '' : 'transform: translateY(-100%);'">
        <img src="@/assets/adlerkopp.svg" alt="adlerkopp" aria-hidden="true" :height="3 * 16" :width="3 * 16" />
        <h1 v-if="small && !expanded" style="font-weight: initial; margin: 0;">{{activeLink.text}}</h1>
        <div v-else class="grad-nav__header">
            <h1>Gruppe Adler</h1>
            <h2 style="opacity: .5;">Deutsche Arma3 Coop & TvT Community</h2>
        </div>
        <button v-if="small" class="grad-nav__menu-btn" @click="expanded = !expanded">
            <svg v-if="expanded" width="28" height="28" viewBox="0 0 28 28">
                <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(45,14,14)"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="13" transform="rotate(-45,14,14)"></rect>
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 28 28">
                <rect fill="currentColor" width="28" height="2" x="0" y="3"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="13"></rect>
                <rect fill="currentColor" width="28" height="2" x="0" y="23"></rect>
            </svg>
        </button>
        <template>
            <ul v-if="!small || expanded" :class="['grad-nav__links', small ? 'grad-nav--small' : '']">
                <li
                    v-for="link in links"
                    :key="link.url"
                    class="grad-nav__link-wrapper"
                    @click="expanded = false;"
                >
                    <router-link
                        class="grad-nav__link"
                        :to="link.url"
                        tag="a"
                    >
                        {{link.text}}
                    </router-link>
                    <template v-if="link.sublinks && !small">
                        <ul class="grad-nav__sub-links">
                            <li v-for="sublink in link.sublinks" :key="sublink.url">
                                <router-link
                                    class="grad-nav__link"
                                    :to="link.url + sublink.url"
                                    tag="a"
                                >
                                    {{sublink.text}}
                                </router-link>
                            </li>
                        </ul>
                    </template>
                </li>
                <li
                    key="/en"
                    class="grad-nav__link-wrapper"
                >
                    <router-link
                        to="/en"
                        tag="a"
                        class="grad-nav__link"
                    >
                        <img src="@/assets/en.svg" alt="english" height="18" width="36" />
                    </router-link>
                </li>
            </ul>
        </template>
        <div v-if="!small || activeLink.sublinks" class="grad-nav__sub-link-bar">
            <ul v-if="small" class="grad-nav__sub-links" style="margin-left: auto;">
                <li v-for="sublink in activeLink.sublinks" :key="sublink.url">
                    <router-link
                        class="grad-nav__link"
                        :to="activeLink.url + sublink.url"
                        tag="a"
                    >
                        {{sublink.text}}
                    </router-link>
                </li>
            </ul>
            <template v-else>
                <span>
                    <template v-if="activeSubLink">{{activeSubLink.text}}</template>
                    <template v-else>{{activeLink.text}}</template>
                </span>
            </template>
        </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import links, { GradLink } from '@/assets/navLinks';

const SMALL_BREAKPOINT = 710;

@Component({
    metaInfo () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.metaInfoMethod();
    }
})
export default class TheNavbarVue extends Vue {
    private links: GradLink[] = links;

    private activeLink: GradLink = { text: '', url: '' };
    private activeSubLink: GradLink | null = null;
    private small = false;
    private expanded = false; // Indicates whether the main nav is shown (only in small)
    private resizeTimeout: number | undefined;
    private pageYOffset = 0; // for hiding nav bar when scrolling
    private navShown = true; // for hiding nav bar when scrolling

    private created () {
        this.updateActiveLink(this.$route);
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
    }

    private updated () {
        this.onResizeTimeout();
        this.$nextTick(this.fixSubLinksOffset);
    }

    private beforeDestroy () {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
    }

    private metaInfoMethod () {
        if (this.activeSubLink !== null) {
            return {
                title: this.activeSubLink.text,
                titleTemplate: '%s - Gruppe Adler'
            };
        }

        if (this.activeLink.text.length > 0) {
            return {
                title: this.activeLink.text,
                titleTemplate: '%s - Gruppe Adler'
            };
        }

        return {};
    }

    @Watch('$route')
    private routeChanged (to: Route, from: Route) {
        if (to.path === from.path) return;

        this.expanded = false;
        this.updateActiveLink(to);
    }

    /**
     * @description Update active link
     * @author DerZade
     * @param {Route} route Route
     */
    private updateActiveLink (route: Route) {
        const url = `/${route.path.split('/')[1]}`;
        const suburl = route.path.replace(new RegExp(`^${url}`, 'i'), '');

        this.activeLink = this.links.find(l => l.url === url) || { text: '', url: '' };
        this.activeSubLink = (this.activeLink.sublinks || []).find(l => l.url === suburl) || null;
    }

    /**
     * @description Window resize handler callback. Calls actual function via a
     *              timeout to prevent a lot of activations in a small amount of time.
     * @author DerZade
     */
    private handleResize () {
        if (this.resizeTimeout !== undefined) window.clearTimeout(this.resizeTimeout);

        this.resizeTimeout = window.setTimeout(this.onResizeTimeout.bind(this), 100);
    }

    /**
     * @description Actual window resize callback
     * @author DerZade
     */
    private onResizeTimeout () {
        if (window.innerWidth < SMALL_BREAKPOINT) {
            this.small = true;
        } else {
            this.small = false;
        }
    }

    /**
     * @description Window scroll handler callback. Hides navbar when user is scrolled down
     * @author DerZade
     */
    private handleScroll () {
        if (this.expanded) return;

        if (pageYOffset > this.pageYOffset) {
            // user scrolled down
            if (pageYOffset > 80) {
                this.navShown = false;
                document.body.classList.add('grad-nav-collapsed');
            }
        } else {
            // user scrolled up
            this.navShown = true;
            document.body.classList.remove('grad-nav-collapsed');
        }
        this.pageYOffset = pageYOffset;
    }

    /**
     * @description Prevents sublinks to clip outside the right window border
     * @author DerZade
     */
    private fixSubLinksOffset () {
        if (this.small) return;

        // find all sub link containers
        const subLinkContainers: Element[] = Array.from(document.querySelectorAll('.grad-nav__sub-links'));

        // get the right edge of the sub-link bar
        const subLinkBar = document.querySelector('.grad-nav__sub-link-bar');
        if (!subLinkBar) return;
        const maxRight = subLinkBar.getBoundingClientRect().right;

        for (const child of subLinkContainers) {
            const elem = child as HTMLElement;
            const right = elem.getBoundingClientRect().right;

            if (right > maxRight) {
                // apply negative left offset to prevent clipping
                elem.style.left = `${maxRight - right}px`;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$navbar-height: 4.5rem;

.grad-nav {
    user-select: none;
    height: $navbar-height;
    display: grid;
    grid-template-columns: [adlerkopp] auto [header] 1fr [links] auto;
    align-items: center;
    padding: 0 1rem;
    grid-column-gap: .5rem;
    transition: transform .25s ease-in-out;

    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    color: white;
    background-color: black;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;

    &__header {
        font-size: .75rem;
        display: flex;
        flex-direction: column;

        > * {
            font-size: .75rem;
            margin: 0;
            font-weight: initial;
        }

        @media (max-width: 900px) {
            display: none;
        }
    }

    &__link {
        cursor: pointer;
        display: flex;
        align-items: center;
        flex: none;
        box-sizing: border-box;
        height: 100%;
        margin: 0 .5rem;
        opacity: 0.7;

        border-color: transparent;
        border-top: .25rem solid transparent;
        border-bottom: .25rem solid transparent;
        padding: 0 .125rem;

        > img {
            height: 1em;
            width: auto;
        }

        &:hover {
            opacity: 1;
        }
    }

    &__links {
        grid-column: links;
        display: flex;
        height: 100%;
        font-size: 1.125rem;
        list-style-type: none;
        margin: 0;
        padding: 0;

        > .grad-nav__link-wrapper {
            position: relative;

            > .grad-nav__link.grad-nav--active { // active link in main links
                opacity: 1;
                border-top-color: #D18D1F;
                border-left-color: #D18D1F;
            }

            &:hover .grad-nav__sub-links {
                // hovering wrapper will show its sub links
                visibility: initial !important;
            }
        }

        &:hover .grad-nav--active + .grad-nav__sub-links {
            // when user hovers any link -> hide sub links of active link
            visibility: hidden;
        }
    }

    &__links#{&}--small {
        position: fixed;
        top: $navbar-height;
        left: 0;
        right: 0;
        bottom: 0;
        height: auto;
        flex-direction: column;
        justify-content: flex-start;
        z-index: 1000;
        background-color: black;

        > .grad-nav__link-wrapper {
            margin-top: .5rem;
            margin-bottom: .5rem;

            > .grad-nav__link {
                line-height: 1.25rem;
                font-size: 1.25rem;
                padding: .25rem 0 .25rem 1.5rem;
                margin-left: 0;
                margin-right: 0;
                border-left-style: solid;
                border-left-width: .25rem;
                border-top: none;
                border-bottom: none;
            }
        }
    }

    &__sub-links {
        z-index: 1;
        visibility: hidden;
        display: flex;
        height: 2.75rem;
        font-size: 0.75rem;
        list-style-type: none;
        margin: 0;
        padding: 0;

        position: absolute;
        top: $navbar-height;
        left: 0;

        .grad-nav__link {
            border-top: .125rem solid transparent;
            border-bottom: .125rem solid transparent;

            &.grad-nav--active { // active sub link
                opacity: 1;
                border-bottom-color: white;
            }
        }

        .grad-nav--active + & { // show sublinks from active link by default
            visibility: initial;
        }
    }

    &__sub-link-bar {
        font-size: 1.25rem;
        padding-right: 1rem;
        padding-left: 2.25rem;
        display: flex;
        align-items: center;

        position: absolute;
        height: 2.75rem;
        top: $navbar-height;
        left: 0;
        right: 0;

        background: linear-gradient(270deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.08) 100%);
        -webkit-backdrop-filter: blur(.25rem);
        backdrop-filter: blur(.25rem);

        > .grad-nav__sub-links {
            visibility: initial;
            position: initial;
        }
    }

    &__menu-btn {
        grid-column: links;
        padding: .75rem;
        background-color: transparent;
        border-radius: initial;
        color: white;
        opacity: .7;

        > svg {
            width: 2.25rem;
            height: 2.25rem;
        }
    }
}
</style>
