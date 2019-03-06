<template>
<div class="grad-nav__small-menu">
    <template v-for="link in links">
        <a 
            
            v-if="!expandedLink || link == expandedLink"
            :key="link.url"
            :class="[activeLink.url === link.url ?'grad-nav--active' : '', expandedLink && expandedLink.url === link.url ?'grad-nav--expanded' : '']"
            @click="mainLinkClicked(link)"
        >
            {{link.text}}
        </a>
        <template v-if="link == expandedLink">
            <router-link 
                v-for="link in expandedLink.sublinks"
                :key="link.url"
                class="grad-nav--sub"
                :to="expandedLink.url + link.url"
                tag="a"
            >
                {{link.text}}
            </router-link>
        </template>
    </template>
    <router-link 
        v-if="expandedLink == null"
        to="/en"
        tag="a"
        :class="[$route.path === '/en' ?'grad-nav--active' : '', 'grad-nav__link']"
    >
        <img src="@/assets/en.png" alt="english" />
    </router-link>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { GradLink } from './GradLink';

@Component
export default class NavbarSmallMenu extends Vue {
    @Prop() private activeLink?: GradLink | null;
    @Prop() private value: GradLink | null = null;

    private links: GradLink[] = require('./links.json');
    private expandedLink: GradLink | null = null;

    /**
     * @description Click handler of main links in small menu
     * @author DerZade
     * @param {GradLink} link Clicked Link
     */
    private mainLinkClicked(link: GradLink) {
        // go to clicked link if it hasn't any sub links
        if (link.sublinks === undefined || Array.isArray(link.sublinks) && link.sublinks.length === 0) {
            this.$router.push(link.url);
            return;
        }

        this.$emit('input', link);
    }

    @Watch('value')
    private updateExpandedLink() {
        this.expandedLink = this.value;
    }
}
</script>


<style lang="scss" scoped>
.grad-nav__small-menu {
    user-select: all;
    overflow: hidden;
    position: fixed;
    top: 72px;
    left: 0px;
    right: 0px; 
    bottom: 0px;
    background-color: black;

    a {
        user-select: none;
    }

    > a {
        cursor: pointer;
        align-items: center;
        display: flex;
        line-height: 20px;
        font-size: 20px;
        padding: 5px 0px 5px 27px;
        margin: 15px 0px;
        border-left: 4px solid transparent;
        opacity: 0.7;

        &.grad-nav--active {
            border-color: #D18D1F;
            opacity: 1;
        }
        &.grad-nav--expanded {
            border-color: #D18D1F;
            opacity: 1;
            font-size: 28px;
            line-height: 28px;
        }

        > img {
            height: 1em;
        }
    }
}
</style>

