<template>
    <div class="grad-footer">
        <span class="grad-footer__desc">Gruppe Adler auf</span>
        <div>
            <a 
                v-for="item in items"
                :href="item.url"
                :key="item.url"
                class="grad-footer__link"
            >
                <img :src="`/footer/${item.image}.png`" :alt="item.image" />
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
        <div class="grad-footer__copyright">© 2019 Gruppe Adler</div>
        <router-link 
                class="grad-footer__login"
                to="/login"
                tag="a"
            >
                LOGIN
        </router-link>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
    private items: object[] = [
        {
            image: 'discord',
            url: 'https://discord.gg/3VUbAAv'
        },
        {
            image: 'youtube',
            url: 'https://www.youtube.com/user/gruppeadler'
        },
        {
            image: 'twitter',
            url: 'https://twitter.com/gruppe_adler'
        },
        {
            image: 'github',
            url: 'https://github.com/gruppe-adler'
        },
        {
            image: 'arma3-units',
            url: 'https://units.arma3.com/unit/gruppe-adler'
        },
        {
            image: 'steam',
            url: 'https://steamcommunity.com/groups/gruppe-adler'
        }
    ];

}
</script>

<style lang="scss" scoped>
.grad-footer {
    margin-top: 50px;
    position: relative;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    > * {
        margin: 0 50px;
        padding-bottom: 50px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    &__link {
        margin: 20px;
        flex: none;
        text-decoration: none;
        color: black;
        cursor: pointer;
        opacity: 0.5;

        img {
            max-height: 30px;
            filter: saturate(0%);
        }

        &:hover {
            opacity: 1;
            img {
                filter: saturate(100%);
            }
        }
    }
    &__desc {
        margin: 20px;
        padding-bottom: 0px;
        opacity: 0.5;
    }
    &__login,
    &__copyright {
        position: absolute;
        bottom: 0px;
        left: 0px;
        font-size: 0.7em;
        opacity: 0.2;
        padding-bottom: 2em;
    }
    &__login {
        left: auto;
        right: 0px;
        text-decoration: none;
        color: black;
    }
}
</style>
