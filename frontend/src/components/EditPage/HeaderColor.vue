<template>
    <div class="grad-header-color">
        <ActionButton v-if="color === null" icon="colorize" tooltip="Kopfzeilen-Farbe ändern" color="#C4C4C4" @click="pickerShown = true" />
        <ActionButton v-else icon="colorize" tooltip="Kopfzeilen-Farbe entfernen" color="#C4C4C4" @click="$emit('input', null)" />
        <div class="grad-header-color__mask" v-if="pickerShown" @click="pickerShown=false"></div>
        <ColorPicker
            class="grad-header-color__color-picker"
            @click.stop="true;"
            v-if="pickerShown"
            theme="dark"
            :color="color || '#D18d1f'"
            :sucker-hide="true"
            :colors-default="['#66AA66', '#6CAACC', '#D18D1F', '#8F1167', '#2F80ED']"
            @changeColor="changeColor"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ActionButtonVue from '@/components/ActionButton.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ColorPickerVue from '@caohenghu/vue-colorpicker';

@Component({
    components: {
        ActionButton: ActionButtonVue,
        ColorPicker: ColorPickerVue
    }
})
export default class EditHeaderColorVue extends Vue {
    @Prop({ required: true }) private value!: string|null;

    private get color (): string|null { return this.value; }
    private set color (val: string|null) { this.$emit('input', val); }

    private pickerShown = false;

    private changeColor ({ rgba }: { rgba: { r: number; g: number; b: number; a: number } }) {
        const { r, g, b, a } = rgba;

        this.color = `rgba(${r},${g},${b},${a})`;
    }
}
</script>

<style lang="scss" scoped>
.grad-header-color {
    position: relative;

    &__mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    &__color-picker {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
