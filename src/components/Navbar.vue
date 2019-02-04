<template>
    <nav :class="[small ? 'grad-nav--small' : '', 'grad-nav ']">
        <div v-if="subExpanded" class="grad-nav__small-menu-btn" @click="back">
            <svg width="9" height="9" viewBox="0 0 9 9">
                <polygon points="0,1 1,0 9,8 8,9" style="fill:red;" />
                <polygon points="9,1 8,0 0,8 1,9" style="fill:red;" />
            </svg>
        </div>
        <div v-else class="grad-nav__header">
            <img src="../assets/adlerkopp256.png" />
            <div v-if="small">
                <span>{{activeLink.text}}</span>
                <span v-if="activeSubLink">{{activeSubLink.text}}</span>
            </div>
            <div v-else class="grad-nav--min1000">
                <span>Gruppe Adler</span>
                <span>Deutsche Arma3 Coop & TvT Community</span>
            </div>
        </div>
        <div v-if="small" class="grad-nav__small-menu-btn">
            <svg v-if="expanded || subExpanded" @click="close" width="9" height="9" viewBox="0 0 9 9" >
                <polygon points="0,1 1,0 9,8 8,9" style="fill:white;" />
                <polygon points="9,1 8,0 0,8 1,9" style="fill:white;" />
            </svg>
            <svg v-else @click="open" width="9" height="9" viewBox="0 0 9 9" >
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="0"></rect>
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="4"></rect>
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="8"></rect>
            </svg>
        </div>
        <div v-if="!small || expanded" ref="main-links" class="grad-nav__links">
            <router-link 
                v-for="link in links"
                :key="link.url"
                :class="[activeLink.url === link.url ?'grad-nav__link--active' : '', 'grad-nav__link']"
                :to="!small ? link.url : ''"
                tag="div"
                @click.native.prevent="mainLinkClicked(link)"
            >
                {{link.text}}
            </router-link>
        </div>
        <div v-if="activeLink.sublinks != undefined && (!small || subExpanded)" class="grad-nav__sub-links">
            <div v-if="subExpanded" class="grad-nav__link grad-nav__link--active">
                {{activeLink.text}}
            </div>
            <div v-if="!small" ref="sub-links-spacer"></div>
            <router-link 
                v-for="link in activeLink.sublinks"
                :key="link.url"
                :class="[activeSubLink.url === link.url ?'grad-nav__link--active' : '', 'grad-nav__sub-link']"
                :to="activeLink.url + link.url"
                tag="div"
            >
                {{link.text}}
            </router-link>
        </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

const SMALL_BREAKPOINT = 750;

interface GradLink {
    text: string;
    url: string;
    sublinks?: GradLink[];
}

@Component ({
    name: 'main-navbar'
})
export default class MainNavbar extends Vue {
    private links: GradLink[] = [
        {
            text: 'Home',
            url: '/home'
        },
        {
            text: 'Über uns',
            url: '/ueber-uns',
            sublinks: [
                {
                    text: 'Miteinander',
                    url: '/miteinander'
                },
                {
                    text: 'Struktur',
                    url: '/struktur'
                },
                {
                    text: 'Eindrücke',
                    url: '/eindruecke'
                }
            ]
        },
        {
            text: 'Technik',
            url: '/technik',
            sublinks: [
                {
                    text: 'Server',
                    url: '/server'
                },
                {
                    text: 'Missionsbau',
                    url: '/missionsbau'
                },
                {
                    text: 'Modding',
                    url: '/modding'
                }
            ]
        },
        {
            text: 'Spielweise',
            url: '/spielweise',
            sublinks: [
                {
                    text: 'Übersicht',
                    url: '/uebersicht'
                },
                {
                    text: 'Addons',
                    url: '/addons'
                },
                {
                    text: 'Missionen',
                    url: '/missionen'
                }
            ]
        },
        {
            text: 'Mitspielen',
            url: '/mitspielen',
            sublinks: [
                {
                    text: 'Allgemeines',
                    url: '/allgemeines'
                },
                {
                    text: 'Checkliste',
                    url: '/checkliste'
                },
                {
                    text: 'Kontakt',
                    url: '/kontakt'
                }
            ]
        },
        {
            text: 'Forum',
            url: '/forum'
        },
        {
            text: 'Wiki',
            url: '/wiki'
        }
    ];

    private activeLink: GradLink = { text: 'ERR', url: ''};
    private activeSubLink: GradLink = { text: 'ERR', url: ''};
    private small: boolean = false;
    private expanded: boolean = false;
    private subExpanded: boolean = false;
    private resizeTimeout: number | undefined;

    private mounted() {
        this.updateActvieLink(this.$route);
        window.addEventListener('resize', this.handleResize);
    }

    private updated() {
        this.onResizeTimeout();
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * @description Update active link
     * @author DerZade
     */
    @Watch('$route')
    private updateActvieLink(to: any) {
        this.expanded = false;
        this.subExpanded = false;

        const url = `/${to.path.split('/')[1]}`;
        const suburl = `/${to.path.split('/')[2]}`;

        this.activeLink = this.links.find(l => l.url === url) || { text: 'ERR', url: ''};
        this.activeSubLink = (this.activeLink.sublinks || []).find(l => l.url === suburl) || { text: 'ERR', url: ''};

        this.fixSubLinkOffset();
    }

    /**
     * @description Click handler of main links in small menu
     * @author DerZade
     */
    private mainLinkClicked(link: GradLink) {
        if (!this.small) return;

        // go to clicked link if it hasn't any sub links
        if (link.sublinks === undefined || Array.isArray(link.sublinks) && link.sublinks.length === 0) {
            this.$router.push(link.url);
            return;
        }

        this.activeLink = link;
        this.expanded = false;
        this.subExpanded = true;
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
        this.subExpanded = false;
        this.updateActvieLink(this.$route);
    }

    /**
     * @description Click callback of back button in small menu
     * @author DerZade
     */
    private back() {
        this.updateActvieLink(this.$route);
        this.expanded = true;
    }

    /**
     * @description Sets width of spacer to align sub links with active main link
     * @author DerZade
     */
    private fixSubLinkOffset() {
        if (this.small) return;

        // get left offset of active main link
        const activeMainLink = (this.$refs['main-links'] as HTMLElement).querySelector('.grad-nav__link--active');
        if (!activeMainLink) return;
        const spacer = this.$refs['sub-links-spacer'] as HTMLElement;

        // set width of spacer to offset of link
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
}
</script>

<style lang="scss" scoped>
.grad-nav {
    height: 80px;
    background-color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    color: white;

    &__links {
        display: flex;
        justify-content: flex-end;
        height: 100%;
    }
    &__link {
        height: 100%;
        flex: none;
        box-sizing: border-box;

        font-size: 20px;
        display: flex;
        align-items: center;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        margin: 0px 10px;
        padding: 0px 5px;
        opacity: 0.7;
        cursor: pointer;

        &.grad-nav__link--active {
            opacity: 1;
            border-top-color: #D18D1F;
        }
    }
    &__sub-link {
        height: 100%;
        box-sizing: border-box;

        font-size: 14px;
        display: flex;
        align-items: center;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
        margin: 0px 10px;
        padding: 0px 2px;
        opacity: 0.7;
        cursor: pointer;

        &.grad-nav__link--active {
            opacity: 1;
            border-bottom-color: white;
        }
    }

    &__header {
        height: 50px;
        flex: none;
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-left: 32px;

        span {
            display: block;

            &:last-child {
                opacity: 0.7;
            }
        }
        img {
            margin-right: 8px;
            height: inherit;
        }
    }

    &__sub-links {
        flex: none;
        display: flex;
        position: absolute;
        top: 80px;
        height: 48px;
        left: 0px;
        right: 0px;
        background: linear-gradient(270deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.08) 100%);
        backdrop-filter: blur(10px);
    }

    &__small-menu-btn {
        flex: none;
        cursor: pointer;
        height: 36px;
        width: 36px;
        margin: 0px 32px;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    &.grad-nav--small {

        .grad-nav__links,
        .grad-nav__sub-links {
            position: absolute;
            top: 80px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            height: auto;
            background-color: black;
            flex-direction: column;
            justify-content: flex-start;

            .grad-nav__sub-link,
            .grad-nav__link {
                height: 40px;
                border-top-width: 0px;
                border-bottom-width: 0px;
                border-left: 4px solid transparent;
                margin: 3px 0px;
                padding-left: 24px;

                &.grad-nav__link--active {
                    border-left-color: #D18D1F;
                }
            }
        }

        // .grad-nav__header {
        //     font-size: 20px;
        //     span {
        //         opacity: 1;
        //     }
        // }
    }

    @media (max-width: 1000px) {
        .grad-nav--min1000 {
            display: none;
        }
    }

}
</style>
