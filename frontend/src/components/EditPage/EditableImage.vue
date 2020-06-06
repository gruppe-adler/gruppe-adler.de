<template>
    <div class="grad-editable-image">
        <slot v-if="img !== null" name="img" :img="img">
            <img v-lazy-img :data-src="img" alt="preview-image">
        </slot>
        <slot v-else name="placeholder">
            <div class="grad-editable-image__placeholder" :style="placeholderStyle">
                <i class="material-icons" style="font-size: inherit">image</i>
            </div>
        </slot>
        <div class="grad-editable-image__actions">
            <template v-if="img === null">
                <i class="material-icons" @click="onClick">add_photo_alternate</i>
            </template>
            <template v-else>
                <i class="material-icons" @click="onClick">photo</i>
                <i class="material-icons" @click="img = null">delete</i>
            </template>
        </div>
        <input type="file" multiple="false" accept="image/jpeg, image/png, .gif, image/svg+xml" ref="file_input" @input="onInput" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EditableImageVue extends Vue {
    @Prop({ required: true }) private value!: string|null;
    @Prop({ default: '', type: String }) private placeholderStyle!: string;

    private get img (): string|null { return this.value; }
    private set img (val: string|null) { this.$emit('input', val); }

    private onClick () {
        const uploadInput = this.$refs.file_input as HTMLInputElement;
        uploadInput.click();
    }

    private onInput () {
        const uploadInput = this.$refs.file_input as HTMLInputElement;
        if (!uploadInput.files) return;

        const file = uploadInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e: ProgressEvent) => {
            if (e.target === null) return;

            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this.img = e.target.result;
        };
    }
}
</script>

<style lang="scss" scoped>
.grad-editable-image {
    color: white;
    position: relative;

    &:hover > #{&}__actions {
        visibility: initial;
    }

    > input {
        display: none;
    }

    > #{&}__placeholder {
        background-color: #C4C4C4;
        display: flex;
        justify-content: center;
        user-select: none;
        align-items: center;
    }

    > #{&}__actions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        visibility: hidden;
        grid-column-gap: .5rem;
        grid-auto-flow: column;

        > i {
            cursor: pointer;
            user-select: none;
            text-transform: none;
            padding: 0.5rem;
            border-radius: 50%;
            width: 1em;
            height: 1em;
            text-align: center;
            line-height: 1em;
            background-color: rgba(black,0.8);
        }
    }
}
</style>
