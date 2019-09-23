<template>
    <article class="grad-container" ref="container">
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
    </article>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Container extends Vue {
    @Prop() private headerColor?: string;

    private mounted() {
        if (!this.headerColor) return;
        (this.$refs.container as HTMLElement).style.setProperty('--grad-container-header-color', this.headerColor);
    }

}
</script>

<style lang="scss">
.grad-container {
    $offset: 200px;

    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.25);
    font-size: 16px;
    width: 100%;

    > * {
        padding: 0px 36px;
    }

    &__header {
        background-color: var(--grad-container-header-color, rgba(240, 236, 232, 0.7));
        z-index: 1;
        position: relative;
        display: flex; 
        align-items: center;
        justify-content: space-between;
        
        height: 72px;
        
        font-size: 21px;
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;
        color: rgba(0,0,0,0.5);

        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        &-image {
            max-height: 45px;
            filter: saturate(0%);
            opacity: 0.4;
        }
    }

    &__image {
        z-index: 0;
        position: relative;
        padding: 0px;
        margin-top: -72px;
        max-height: 360px;
        overflow: hidden;

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        > * {
            max-width: 100%;
        }

    }

    &__content {
        color: #666666;
        margin-top: 18px;
        margin-bottom: 18px;
        line-height: 2em;

        > div {
            width: 100%;
        }

        a {
            color: #2F80ED;
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
        padding-top: 18px;
        padding-bottom: 19px;
        background: rgba(240, 236, 232, 0.7);
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
        color: #666666;

        > div {
            width: 100%;
        }
    }

    & + & {
        margin-top: 30px;
    }
}
</style>

