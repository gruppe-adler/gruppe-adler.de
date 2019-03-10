<template>
    <nav :class="['grad-nav', navShown ? '' : 'grad-nav--hidden']">
        <NavBack v-if="expandedLink" @click="back" />
        <div v-else class="grad-nav__header">
            <img src="@/assets/adlerkopp.svg" alt="adlerkopp" />
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
            <div ref="main-links" class="grad-nav__links">
                <router-link 
                    v-for="link in links"
                    :key="link.url"
                    class="grad-nav__link"
                    :to="!small ? link.url : ''"
                    tag="a"
                >
                    {{link.text}}
                </router-link>
                <router-link 
                    to="/en"
                    tag="a"
                    class="grad-nav__link"
                >
                    <img src="@/assets/en.png" alt="english" />
                </router-link>
            </div>
            <div class="grad-nav__sub-links">
                <div ref="sub-links-spacer" style="transition: width 0.1s ease-in-out;"></div>
                <router-link 
                    v-for="link in activeLink.sublinks"
                    :key="link.url"
                    class="grad-nav__link"
                    :to="activeLink.url + link.url"
                    tag="a"
                >
                    {{link.text}}
                </router-link>
            </div>
        </template>
    </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import NavBack from './Navbar/small-menu-btn/Back.vue';
import NavMenu from './Navbar/small-menu-btn/Menu.vue';
import NavClose from './Navbar/small-menu-btn/Close.vue';
import SmallMenu from './Navbar/SmallMenu.vue';
import { GradLink } from './Navbar/GradLink';
import { Route } from 'vue-router';

const SMALL_BREAKPOINT = 710;

@Component ({
    name: 'navbar',
    components: { NavMenu, NavClose, NavBack, SmallMenu }
})
export default class Navbar extends Vue {
    private links: GradLink[] = require('./Navbar/links.json');

    private activeLink: GradLink = { text: '', url: ''};
    private activeSubLink: GradLink | null = null;
    private small: boolean = false;
    private expanded: boolean = false;              // Indicates whether the main nav is shown (only in small)
    private resizeTimeout: number | undefined;
    private expandedLink: GradLink | null = null;   // v-model of small menu
    private pageYOffset: number = 0;                // for hiding nav bar when scrolling
    private navShown: boolean = true;               // for hiding nav bar when scrolling

    private mounted() {
        this.updateActiveLink(this.$route);
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
        setTimeout(this.fixSubLinkOffset, 100);
    }

    private updated() {
        this.onResizeTimeout();
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
    }

    @Watch('$route')
    private routeChanged(to: Route, from: Route) {
        if (to.path === from.path) return;

        this.expanded = false;
        this.updateActiveLink(to);
    }

    @Watch('expanded')
    private resetExpandedLink(expanded: boolean) {
        if (!expanded) this.expandedLink = null;
    }

    /**
     * @description Update active link
     * @author DerZade
     * @param {any} route Route
     */
    private updateActiveLink(route: any) {
        const url = `/${route.path.split('/')[1]}`;
        const suburl = route.path.replace(new RegExp(`^${url}`, 'i'), '');

        this.activeLink = this.links.find(l => l.url === url) || { text: '', url: ''};
        this.activeSubLink = (this.activeLink.sublinks || []).find(l => l.url === suburl) || null;

        this.fixSubLinkOffset();
    }

    /**
     * @description Click callback of open button in small menu
     * @author DerZade
     */
    private open() {
        this.expanded = true;
    }

    /**
     * @description Click callback of close button in small menu
     * @author DerZade
     */
    private close() {
        this.expanded = false;
    }

    /**
     * @description Click callback of back button in small menu
     * @author DerZade
     */
    private back() {
        this.expandedLink = null;
    }

    /**
     * @description Sets width of spacer to align sub links with active main link
     * @author DerZade
     */
    private fixSubLinkOffset() {
        if (this.small) return;

        // get left offset of active main link
        const activeMainLink = (this.$refs['main-links'] as HTMLElement).querySelector('.grad-nav--active');
        if (!activeMainLink) return;

        // set width of spacer to offset of link
        const spacer = this.$refs['sub-links-spacer'] as HTMLElement;
        if (!spacer) return;
        spacer.style.width = `${activeMainLink.getBoundingClientRect().left}px`;
    }

    /**
     * @description Window resize handler callback. Calls actual function via a
     *              timeout to prevent a lot of activations in a small amount of time.
     * @author DerZade
     */
    private handleResize() {
        if (this.resizeTimeout !== undefined) clearTimeout(this.resizeTimeout);

        setTimeout(this.onResizeTimeout.bind(this), 100);
    }

    /**
     * @description Actual window resize callback
     * @author DerZade
     */
    private onResizeTimeout() {
        if (window.innerWidth < SMALL_BREAKPOINT) {
            this.small = true;
        } else {
            if (!this.small) {
                this.$nextTick(() => this.fixSubLinkOffset());
            } else {
                this.small = false;
            }
        }
    }

    /**
     * @description Window scroll handler callback. Hides navbar when user is scrolled down
     * @author DerZade
     */
    private handleScroll(event: Event) {
        if (this.expanded) return;

        if (pageYOffset > this.pageYOffset) {
            // user scrolled down
            if (pageYOffset > 80) {
                this.navShown = false;
            }
        } else {
            // user scrolled up
            this.navShown = true;
        }
        this.pageYOffset = pageYOffset;
    }

}
</script>

<style lang="scss" scoped>
$navbar-height: 72px;

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
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 1000;
    transition: top .25s ease-in-out;

    a {
        color: inherit;
        text-decoration: none;
        font-weight: inherit;
    }

    &.grad-nav--hidden {
        top: - $navbar-height;
    }
    
    &__header {
        height: 45px;
        flex: none;
        display: flex;
        align-items: center;
        margin-left: 21px;

        img {
            margin-right: 8px;
            height: 50px;
        }
        span {
            font-size: 12px;
            display: block;

            &:nth-child(2) {
                opacity: 0.5;
            }

            &:only-child {
                font-size: 27px;
            }
        }
    }

    &__links {
        display: flex;
        justify-content: flex-end;
        height: 100%;
        font-size: 18px;

        .grad-nav--active {
            opacity: 1;
            border-top-color: #D18D1F;
        }
    }
    &__sub-links {
        display: flex;
        height: 43px;
        font-size: 12px;

        position: absolute;
        top: $navbar-height;
        left: 0px;
        right: 0px;

        background: linear-gradient(270deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.08) 100%);
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);


        .grad-nav__link {
            opacity: 0.5;
            margin: 0px 10px;
            border-top: 2px solid transparent;
            border-bottom: 2px solid transparent;
        }
        .grad-nav--active {
            opacity: 1;
            border-bottom-color: white;
        }
    }

    &__link {
        cursor: pointer;
        display: flex;
        align-items: center;
        flex: none;
        box-sizing: border-box;
        height: 100%;
        margin: 0px 10px;
        opacity: 0.7;

        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        padding: 0px 2px;

        > img {
            height: 1em;
            // filter: saturate(0%);
        }
        &.grad-nav--active, &:hover {
            > img {
                filter: saturate(100%);
            }
        }
    }
    
    @media (max-width: 1000px) {
        .grad-nav--min1000 {
            display: none;
        }
    }


}
</style>
