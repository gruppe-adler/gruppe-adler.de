<template>
    <nav :class="['grad-nav', navShown ? '' : 'grad-nav--hidden']">
        <NavBack v-if="small && expandedLink" @click="back" />
        <div v-else class="grad-nav__header" @click="$router.push('/')">
            <img src="@/assets/adlerkopp.svg" alt="adlerkopp" aria-hidden="true" />
            <div v-if="small">
                <span>{{activeLink.text}}</span>
                <span v-if="activeSubLink">{{activeSubLink.text}}</span>
            </div>
            <div v-else class="grad-nav--min1000">
                <span>Gruppe Adler</span>
                <span>Deutsche Arma3 Coop & TvT Community</span>
            </div>
        </div>
        <template v-if="small">
            <NavClose v-if="expanded" @click="close" />
            <NavMenu v-else @click="open" />
            <SmallMenu v-show="expanded" :activeLink="activeLink" v-model="expandedLink" />
        </template>
        <template v-else>
            <ul class="grad-nav__links">
                <li
                    v-for="link in links"
                    :key="link.url"
                    class="grad-nav__link-wrapper"
                >
                    <router-link
                        class="grad-nav__link"
                        :to="link.url"
                        tag="a"
                    >
                        {{link.text}}
                    </router-link>
                    <template v-if="link.sublinks">
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
                        <img src="@/assets/en.svg" alt="english" />
                    </router-link>
                </li>
            </ul>
            <div class="grad-nav__sub-link-bar">
                <span v-if="activeSubLink">{{activeSubLink.text}}</span>
                <span v-else>{{activeLink.text}}</span>
            </div>
        </template>
    </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import NavBackVue from './TheNavbar/small-menu-btn/Back.vue';
import NavMenuVue from './TheNavbar/small-menu-btn/Menu.vue';
import NavCloseVue from './TheNavbar/small-menu-btn/Close.vue';
import SmallMenuVue from './TheNavbar/SmallMenu.vue';
import { Route } from 'vue-router';
import links, { GradLink } from '@/assets/navLinks';

const SMALL_BREAKPOINT = 710;

@Component({
    name: 'navbar',
    components: {
        NavMenu: NavMenuVue,
        NavClose: NavCloseVue,
        NavBack: NavBackVue,
        SmallMenu: SmallMenuVue
    },
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
    private expandedLink: GradLink | null = null; // v-model of small menu
    private pageYOffset = 0; // for hiding nav bar when scrolling
    private navShown = true; // for hiding nav bar when scrolling

    private mounted () {
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

    @Watch('expanded')
    private resetExpandedLink (expanded: boolean) {
        if (!expanded) this.expandedLink = null;
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
     * @description Click callback of open button in small menu
     * @author DerZade
     */
    private open () {
        this.expanded = true;
    }

    /**
     * @description Click callback of close button in small menu
     * @author DerZade
     */
    private close () {
        this.expanded = false;
    }

    /**
     * @description Click callback of back button in small menu
     * @author DerZade
     */
    private back () {
        this.expandedLink = null;
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    color: white;
    background-color: black;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    transition: top .25s ease-in-out;

    &.grad-nav--hidden {
        top: - $navbar-height;
    }

    &__header {
        cursor: pointer;
        flex: none;
        display: flex;
        align-items: center;
        margin-left: 1rem;

        img {
            margin-right: .5rem;
            height: 3rem;
        }
        span {
            font-size: .75rem;
            display: block;

            &:nth-child(2) {
                opacity: 0.5;
            }

            &:only-child {
                font-size: 1.75rem;
            }
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

        border-top: .25rem solid transparent;
        border-bottom: .25rem solid transparent;
        padding: 0 .125rem;

        > img {
            height: 1em;
        }

        &:hover {
            opacity: 1;
        }
    }

    &__links {
        display: flex;
        justify-content: flex-end;
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
    }

    @media (max-width: 1000px) {
        .grad-nav--min1000 {
            display: none;
        }
    }

}
</style>
