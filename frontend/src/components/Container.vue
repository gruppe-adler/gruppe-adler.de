<template>
    <section class="grad-container" ref="container">
        <header v-if="$slots.header" class="grad-container__header">
            <slot name="header" />
        </header>
        <div v-if="$slots.image" class="grad-container__image">
            <slot name="image" />
        </div>
        <div class="grad-container__content">
            <slot />
        </div>
        <footer v-if="$slots.footer && $slots.footer !== ''" class="grad-container__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ContainerVue extends Vue {
    @Prop() private headerColor?: string;

    private mounted () {
        this.updateHeaderColor();
    }

    @Watch('headerColor')
    private updateHeaderColor () {
        this.$nextTick(() => {
            if (this.headerColor) {
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-color', this.headerColor);
            } else {
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-color', '');
            }
        });
    }
}
</script>

<style lang="scss">
@import "../assets/colors.scss";
@media (prefers-color-scheme: dark) {
    @import "../assets/colors-dark.scss";
}
.grad-container {
    background-color: white;
    @media (prefers-color-scheme: dark) {
            background-color: rgb(44, 44, 44);
        }
    border-radius: .25rem;
    box-shadow: $tile-shadow;
    font-size: 1.125rem;
    width: 100%;
    display: inline-block;
    position: relative;

    > * {
        padding: 0 2.25rem;
    }

    &__header {
        background-color: var(--grad-container-header-color, rgba(240, 236, 232, 0.7));
        @media (prefers-color-scheme: dark) {
            background-color: var(--grad-container-header-color, rgba(0, 0, 0, 0));
        }
        z-index: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 4.5rem;

        font-size: 1.3125rem;
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;
        color: rgba(0,0,0,0.5);
        @media (prefers-color-scheme: dark) {
            color: rgba(255,255,255,0.2);
        }

        -webkit-backdrop-filter: blur(.25rem);
        backdrop-filter: blur(.25rem);
        @media (prefers-color-scheme: dark) {
            -webkit-backdrop-filter: initial;
            backdrop-filter: initial;
        }

        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;

        &-image {
            max-height: 3rem;
            filter: saturate(0%);
            opacity: 0.4;
        }
    }

    #gastspieler &__header {
        @media (prefers-color-scheme: dark) {
            color: #2c2c2c;
        }
    }

    #stammspieler &__header {
        @media (prefers-color-scheme: dark) {
            color: #2c2c2c;
        }
    }

    #anwärter &__header {
        @media (prefers-color-scheme: dark) {
            color: #2c2c2c;
        }
    }

    #adler &__header {
        @media (prefers-color-scheme: dark) {
            color: #2c2c2c;
        }
    }

    #führung &__header {
        @media (prefers-color-scheme: dark) {
            color: rgba(255,255,255,0.6);
        }
    }

    #adler-a\.d\. &__header {
        @media (prefers-color-scheme: dark) {
            color: #2c2c2c;
        }
    }

    &__image {
        z-index: 0;
        position: relative;
        padding: 0;
        margin-top: -4.5rem;
        max-height: 22.5rem;
        overflow: hidden;

        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;

        > * {
            max-width: 100%;
        }

    }

    &__content {
        color: #666666;
        @media (prefers-color-scheme: dark) {
            color: rgba(255, 255, 255, 0.45);
        }
        margin-top: 1.125rem;
        margin-bottom: 1.125rem;
        line-height: 1.7em;

        /* These are technically the same, but use both */
        overflow-wrap: break-word;
        word-wrap: break-word;

        > div {
            width: 100%;
        }

        a {
            color: #2F80ED;
            @media (prefers-color-scheme: dark) {
                color: #438CEE;
            }
            font-weight: bold;
            text-decoration: none;
            transition: color .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }

        a:hover {
            color: #2057A1;
            transition: color .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }

    }

    &__footer {
        display: flex;
        align-items: center;
        padding-top: 1.125rem;
        padding-bottom: 1.125rem;
        background: rgba(240, 236, 232, 0.7);
        @media (prefers-color-scheme: dark) {
            background: rgba(0, 0, 0, 0.1);
        }
        -webkit-backdrop-filter: blur(.25rem);
        backdrop-filter: blur(.25rem);
        color: #666666;
        border-bottom-left-radius: .25rem;
        border-bottom-right-radius: .25rem;

        > div {
            width: 100%;
        }
    }

    & + & {
        margin-top: 2rem;
    }
}
</style>
