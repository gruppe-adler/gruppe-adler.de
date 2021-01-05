<template>
    <footer class="grad-footer">
        <span class="grad-footer__desc">Gruppe Adler auf</span>
        <div>
            <a
                v-for="item in items"
                :href="item.url"
                :key="item.url"
                class="grad-footer__link"
                target="_blank"
                rel="noreferrer"
            >
                <picture v-lazy-img :data-alt="item.image">
                    <source :srcset="`/img/footer/dark/${item.image}.svg`" media="(prefers-color-scheme: dark)">
                    <source :srcset="`/img/footer/${item.image}.svg`">
                </picture>
            </a>
        </div>
        <div>
            <router-link
                class="grad-footer__link"
                to="/datenschutzerklaerung"
                tag="a"
            >
                DATENSCHUTZERKLÄRUNG
            </router-link>
            <router-link
                class="grad-footer__link"
                to="/impressum"
                tag="a"
            >
                IMPRESSUM
            </router-link>
        </div>
        <div class="grad-footer__copyright">© 2021 Gruppe Adler</div>
        <a
            v-if="$root.isLoggedIn()"
            class="grad-footer__login"
            @click="logout"
        >
            LOGOUT
        </a>
        <a
            v-else-if="loadingText.length > 0"
            class="grad-footer__login"
        >
            <span style="font-size: 2em; font-weight: bold;">{{loadingText}}</span>
        </a>
        <a
            v-else
            class="grad-footer__login"
            @click="login"
        >
            LOGIN
        </a>
    </footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { authenticate } from '@/services/sso';

import footerItems from '@/assets/footerItems';

@Component
export default class TheFooterVue extends Vue {
    private items = footerItems;

    private loadingText = '';

    private created () {
        // preserve login when reloading the page
        const item = sessionStorage.getItem('grad-homepage-was-logged-in');
        if (!item) return;

        sessionStorage.removeItem('grad-homepage-was-logged-in');

        this.login(false);
    }

    /**
     * Checks if user was redirect to this page after SSO login and tries to authenticate
     * against SSO
     */
    @Watch('$route')
    private onRouteChanged () {
        const item = sessionStorage.getItem('grad-homepage-redirected-from-login');
        if (!item) return;

        if (item === window.location.href) {
            sessionStorage.removeItem('grad-homepage-redirected-from-login');
            this.login(false);
        }
    }

    private async logout () {
        this.$root.$data.user = null;

        const item = sessionStorage.getItem('grad-homepage-was-logged-in');
        if (item) sessionStorage.removeItem('grad-homepage-was-logged-in');
    }

    /**
     * Authenticates user against SSO api.
     * @async
     * @param {boolean?} [redirectToSSO] redirect user to sso if not logged in (default: true)
     */
    private async login (redirectToSSO = true) {
        let user;

        const int = window.setInterval(this.loadingIndicator, 100);

        try {
            user = await authenticate();
        } catch (err) {
            window.clearInterval(int);
            this.loadingText = '';
            console.error(err);
            return;
        }
        window.clearInterval(int);
        this.loadingText = '';

        // the user is logged in if we get a user from the authentication request
        if (user) {
            const groups = user.groups.map(g => g.tag);
            const admin = user.admin;
            let isInGroup = false;

            for (const grp of ['adler', 'fuehrung']) {
                if (!groups.includes(grp)) isInGroup = true;
            }

            if (!admin && !isInGroup) return;

            this.$root.$data.user = user;
            sessionStorage.setItem('grad-homepage-was-logged-in', 'true');
            return;
        }

        if (!redirectToSSO) return;

        // save route user is currently on we will use this to detect that the user
        // was redirected to this page after a successfull redirect
        sessionStorage.setItem('grad-homepage-redirected-from-login', window.location.href);

        // redirect to SSO
        const url = new URL('https://sso.gruppe-adler.de');
        url.searchParams.append('redirect_after_login', window.location.href);
        window.location.replace(url.href);
    }

    private loadingIndicator () {
        if (this.loadingText.length < 5) {
            this.loadingText = `${this.loadingText}.`;
        } else {
            this.loadingText = '.';
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/color-macros.scss";

.grad-footer {
    margin-top: 3rem;
    position: relative;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    > * {
        margin: 0 3rem;
        padding-bottom: 3rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    &__link {
        padding: 1.25rem;
        border-radius: .25rem;
        flex: none;
        color: $text-color-primary;
        cursor: pointer;
        opacity: 0.7;

        picture {
            height: 2.5rem;
            width: auto;
            filter: saturate(0%);

            > img {
                height: inherit;
            }
        }

        &:hover {
            opacity: 1;
            picture {
                filter: saturate(100%);
            }
        }

    }
    &__desc {
        margin: 1.25rem;
        padding-bottom: 0;
        opacity: 0.7;
    }
    &__login,
    &__copyright {
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 0.7em;
        opacity: 0.7;
        padding-bottom: 2em;
    }
    &__login {
        left: auto;
        cursor: pointer;
        right: 0;
    }
}
</style>
