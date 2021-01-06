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
import { contrastColor } from '@/services/color';

@Component
export default class ContainerVue extends Vue {
    @Prop() private headerColor?: string;

    private created () {
        this.updateHeaderColor();
    }

    @Watch('headerColor')
    private updateHeaderColor () {
        this.$nextTick(() => {
            if (this.headerColor) {
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-color', this.headerColor);

                const textColor = contrastColor(this.headerColor);
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-text-color', textColor || '');
            } else {
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-color', '');
                (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-text-color', '');
            }
        });
    }
}
</script>

<style lang="scss">
@import "@/assets/color-macros.scss";

.grad-container {
    background-color: $background-container;
    border-radius: .25rem;
    box-shadow: 0 .25rem 3.75rem $container-shadow, 0 .125rem 1.25rem $container-shadow;
    font-size: 1.125rem;
    width: 100%;
    display: inline-block;
    position: relative;
    word-wrap: break-word;

    > * {
        padding: 0 2.25rem;
    }

    &__header {
        background-color: var(--grad-container-header-color, $background-container-header);
        color: var(--grad-container-header-text-color, $text-color-secondary);
        z-index: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 4.5rem;

        font-size: 1.3125rem;
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;

        -webkit-backdrop-filter: blur(.25rem);
        backdrop-filter: blur(.25rem);

        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;

        &-image {
            max-height: 3rem;
            filter: saturate(0%);
            opacity: 0.4;

            @media (prefers-color-scheme: dark) {
                filter: saturate(0%) invert(1);
            }
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
        color: $text-color-primary;
        margin-top: 1.125rem;
        margin-bottom: 1.125rem;
        line-height: 1.7em;

        /* These are technically the same, but use both */
        overflow-wrap: break-word;
        word-wrap: break-word;

        > div {
            width: 100%;
        }

        &:empty {
            margin: 0;
        }
    }

    &__footer {
        display: flex;
        align-items: center;
        padding-top: 1.125rem;
        padding-bottom: 1.125rem;
        background: $background-container-footer;
        -webkit-backdrop-filter: blur(.25rem);
        backdrop-filter: blur(.25rem);
        color: $text-color-secondary;
        border-bottom-left-radius: .25rem;
        border-bottom-right-radius: .25rem;

        > div {
            width: 100%;
        }
    }

    &__footer a,
    &__content a {
        color: $action-color;
        font-weight: bold;
        text-decoration: none;
        transition: color 0.05s cubic-bezier(0.455, 0.03, 0.515, 0.955);

        &:hover {
            color: $action-color-hover;
        }
    }

    & + & {
        margin-top: 2rem;
    }
}
</style>
