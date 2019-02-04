<template>
    <nav :class="[small ? 'grad-nav--small' : '', 'grad-nav ']">
        <div class="grad-nav__header">
            <img src="../assets/adlerkopp256.png" />
            <div v-if="small">
                <span>{{activeLink.text}}</span>
            </div>
            <div v-else>
                <span>Gruppe Adler</span>
                <span>Deutsche Arma3 Coop & TvT Community</span>
            </div>
        </div>
        <div v-if="small" class="grad-nav__small-menu-btn" @click="clickSmallMenuBtn">
            <svg width="9" height="9" viewBox="0 0 9 9" v-if="expanded || subExpanded">
                <polygon points="0,1 1,0 9,8 8,9" style="fill:white;" />
                <polygon points="9,1 8,0 0,8 1,9" style="fill:white;" />
            </svg>
            <svg width="9" height="9" viewBox="0 0 9 9" v-else>
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="0"></rect>
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="4"></rect>
                <rect fill="#FFFFFF" width="9" height="1" x="0" y="8"></rect>
            </svg>
        </div>
        <div class="grad-nav__links" v-if="!small || expanded">
            <router-link 
                v-for="link in links"
                :key="link.url"
                :class="[activeLink.url === link.url ?'grad-nav__link--active' : '', 'grad-nav__link']"
                :to="!small ? link.url : ''"
                tag="div"
                @click.native.prevent="showSmallSubMenu(link)"
            >
                {{link.text}}
            </router-link>
        </div>
        <div class="grad-nav__sub-links" v-if="!small || subExpanded">
            <div v-if="subExpanded" class="grad-nav__link grad-nav__link--active">
                {{activeLink.text}}
            </div>
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

    private mounted() {
        this.updateActvieLink(this.$route);
    }

    @Watch('$route')
    private updateActvieLink(to: any) {
        this.expanded = false;
        this.subExpanded = false;

        const url = `/${to.path.split('/')[1]}`;
        const suburl = `/${to.path.split('/')[2]}`;

        this.activeLink = this.links.find(l => l.url === url) || { text: 'ERR', url: ''};
        this.activeSubLink = (this.activeLink.sublinks || []).find(l => l.url === suburl) || { text: 'ERR', url: ''};
    }

    private showSmallSubMenu(link: GradLink) {
        if (!this.small) return;

        // go to clicked link if it hasn't any sub links
        if (link.sublinks === null || Array.isArray(link.sublinks) && link.sublinks.length === 0) {
            this.$router.push(link.url);
            return;
        }

        this.activeLink = link;

        this.expanded = false;
        this.subExpanded = true;
    }

    private clickSmallMenuBtn() {
        this.expanded = (!this.subExpanded && !this.expanded);
        this.subExpanded = false;

        if (!this.expanded) {
            this.updateActvieLink(this.$route);
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
        box-sizing: border-box;

        font-size: 20px;
        display: flex;
        align-items: center;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        margin: 0px 15px;
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
        display: flex;
        justify-content: center;
        position: absolute;
        top: 80px;
        height: 48px;
        left: 0px;
        right: 0px;
        background: linear-gradient(270deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.08) 100%);
        backdrop-filter: blur(10px);
    }

    &__small-menu-btn {
        cursor: pointer;
        height: 36px;
        width: 36px;
        margin-right: 32px;

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

        .grad-nav__header {
            font-size: 20px;
            span {
                opacity: 1;
            }
        }
    }

}
</style>
