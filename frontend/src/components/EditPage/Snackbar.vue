<template>
    <div v-if="value.length > 0" class="grad-snackbar">
        <span>{{ value }}</span>
        <i class="material-icons" @click="$emit('input', '')" style="cursor: pointer;">close</i>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component
export default class SnackbarVue extends Vue {
    @Prop({ default: 'gespeichert', type: String }) private value!: string;
    @Prop({ default: 5000, type: Number }) private duration!: number;
    @Prop({ default: '', type: String }) private color!: string;

    private mounted () {
        this.onValueChanged();
    }

    @Watch('value')
    private onValueChanged () {
        if (this.value.length === 0) return;

        window.setTimeout(() => this.$emit('input', ''), this.duration);
    }

    private updated () {
        if (!this.$el) return;
        if (!(this.$el as HTMLElement).style) return;

        (this.$el as HTMLElement).style.setProperty('--grad-snackbar-color', this.color);
    }
}
</script>

<style lang="scss" scoped>
.grad-snackbar {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    width: auto;
    grid-column-gap: 2rem;
    padding: 1rem;
    font-size: 1rem;
    color: white;
    border-radius: .5rem;

    background-color: var(--grad-snackbar-color, #6CAACC);
    box-shadow: 0 .25rem 2.75rem rgba(0, 0, 0, 0.25);
}
</style>
