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
        <footer v-if="$slots.footer" class="grad-container__footer">
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


<style lang="scss" scoped>
$offset: 200px;

.grad-container {
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.25);
    font-size: 18px;
    width: 100%;

    > * {
        padding: 0px 40px;
    }

    &__header {
        background-color: var(--grad-container-header-color, rgba(240, 236, 232, 0.7));
        z-index: 1;
        position: relative;
        display: flex; 
        align-items: center;
        justify-content: space-between;
        
        height: 80px;
        
        font-size: 24px;
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;
        color: rgba(0,0,0,0.5);

        // background: rgba(240, 236, 232, 0.7);
        backdrop-filter: blur(40px);

        &-image {
            max-height: 70px;
        }
    }

    &__image {
        z-index: 0;
        position: relative;
        padding: 0px;
        margin-top: -80px;
        max-height: 400px;
        overflow: hidden;

        > * {
            max-width: 100%;
        }

    }

    &__content {
        padding-top: 40px;
        padding-bottom: 20px;

        &:last-child {
            padding-bottom: 40px;
        }
    }

    &__footer {
        display: flex;
        align-items: center;

        height: 66px;
        background: rgba(240, 236, 232, 0.7);
        backdrop-filter: blur(40px);
        color: #666666;
    }


    & + & {
        margin-top: 32px;
    }
}
</style>

