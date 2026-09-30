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
                :aria-label="item.name"
            >
                <picture v-lazy-img :data-alt="item.name">
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
import { Component, Vue } from 'vue-property-decorator';

import {
    authenticate,
    login as startLogin,
    logout as startLogout
} from '@/services/sso';

import footerItems from '@/assets/footerItems';

@Component
export default class TheFooterVue extends Vue {
    private items = footerItems;

    private loadingText = '';

    private async created () {
        await this.checkAuthentication();
    }

    private async checkAuthentication () {
        const int = window.setInterval(this.loadingIndicator, 100);

        try {
            const user = await authenticate();

            if (user) {
                this.$root.$data.user = user;
            } else {
                this.$root.$data.user = null;
            }
        } catch (err) {
            console.error(err);
            this.$root.$data.user = null;
        } finally {
            window.clearInterval(int);
            this.loadingText = '';
        }
    }

    private login () {
        startLogin();
    }

    private logout () {
        this.$root.$data.user = null;
        startLogout();
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
