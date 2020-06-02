<template>
    <div class="grad-tooltip" @mouseenter="shown = true;" @mouseleave="shown = false;">
        <slot/>
        <span ref="tooltip" v-if="shown && text.length > 0" class="grad-tooltip__text">{{text}}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class TooltipVue extends Vue {
    @Prop({ default: '' }) private text!: string;
    private shown = false;

    /**
     * @description Adjusts position of tooltip to make sure it doesn't clip over the left side of the screen
     * @author DerZade
     */
    @Watch('shown')
    private fixClipping () {
        if (!this.shown) return;

        // try again on the next tick if the text field wrapper isn't rendered atm
        if (!this.$refs.tooltip) return this.$nextTick(this.fixClipping);

        // find offset from left screen border
        const div = this.$refs.tooltip as HTMLSpanElement;
        const left = div.getBoundingClientRect().left;

        // make sure the wrapper is a minimum 8px away of the left screen border
        if (left > 8) {
            div.style.marginLeft = '';
        } else {
            const prevMargin = div.style.marginLeft ? Number.parseFloat(div.style.marginLeft) : 0;

            div.style.marginLeft = `${prevMargin + 8 - left}px`;
        }
    }
}
</script>

<style lang="scss" scoped>
.grad-tooltip {
    position: relative;
    display: flex;
    justify-content: center;
    font-family: 'Source Sans Pro', sans-serif;
    text-transform: none;

    &__text {
        color: white;
        white-space: nowrap;
        background-color: rgba(black, 0.8);
        padding: 8px;
        border-radius: 4px;
        position: absolute;
        font-size: 14px;
        font-weight: bold;
        top: 0px;
        letter-spacing: 0.08em;
        transform: translateY( calc(-100% - 4px) );
        z-index: 2;
    }
}
</style>
