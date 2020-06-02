<template>
    <transition-group name="small-menu" tag="div" class="grad-nav__small-menu">
        <template v-for="link in links">
            <router-link
                v-show="!expandedLink || link == expandedLink"
                :to="link.url"
                tag="a"
                class="grad-nav__link"
                :key="link.url"
                event=""
                :class="[expandedLink && expandedLink.url === link.url ?'grad-nav--expanded' : '']"
                @click.native="mainLinkClicked(link)"
            >
                {{link.text}}
            </router-link>
            <template v-if="link.sublinks">
                <router-link
                    v-for="sublink in link.sublinks"
                    v-show="link == expandedLink"
                    :key="link.url + sublink.url"
                    class="grad-nav--sub"
                    :to="link.url + sublink.url"
                    tag="a"
                >
                    {{sublink.text}}
                </router-link>
            </template>
        </template>
        <router-link
            v-if="expandedLink == null"
            key="/en"
            to="/en"
            tag="a"
            class="grad-nav__link"
        >
            <img src="@/assets/en.svg" alt="english" />
        </router-link>
    </transition-group>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import links, { GradLink } from '@/assets/navLinks';

@Component
export default class NavbarSmallMenu extends Vue {
    @Prop() private activeLink?: GradLink | null;
    @Prop() private value: GradLink | null = null;

    private links: GradLink[] = links;
    private expandedLink: GradLink | null = null;

    /**
     * @description Click handler of main links in small menu
     * @author DerZade
     * @param {GradLink} link Clicked Link
     */
    private mainLinkClicked (link: GradLink) {
        // go to clicked link if it hasn't any sub links
        if (link.sublinks === undefined || (Array.isArray(link.sublinks) && link.sublinks.length === 0)) {
            this.$router.push(link.url);
            return;
        }

        this.$emit('input', link);
    }

    @Watch('value')
    private updateExpandedLink () {
        this.expandedLink = this.value;
    }
}
</script>

<style lang="scss" scoped>
.grad-nav__small-menu {
    overflow: hidden;
    position: fixed;
    top: 72px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: black;

    > a {
        display: block;
        overflow-y: hidden;
        cursor: pointer;
        align-items: center;
        display: flex;
        line-height: 20px;
        font-size: 20px;
        padding: 5px 0px 5px 27px;
        margin: 15px 0px;
        border-left: 4px solid transparent;
        opacity: 0.7;

        &.grad-nav__link.grad-nav--active {
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

        &.small-menu-enter-active,
        &.small-menu-leave-active {
        transition: all 0.15s;
        }
        &.small-menu-enter,
        &.small-menu-leave-to {
            height: 0px;
            margin-top: 0px;
            margin-bottom: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            opacity: 0;
        }
    }
}

</style>
