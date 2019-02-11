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
                <img :src="`/footer/${item.image}.png`" />
            </a>
        </div>
        <div>
            <router-link 
                class="grad-footer__link"
                to="/datebschutzerklaerung"
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
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    > * {
        margin: 0 50px;
        margin-bottom: 50px;
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
            max-height: 40px;
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
        opacity: 0.5;
    }
}
</style>
