<template>
    <div class="grad-editable-field">
        <slot name="edit" v-if="editMode"></slot>
        <template v-else>
            <slot />
            <div class="grad-editable-field__overlay" @click="editMode = true"></div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EditableFieldVue extends Vue {
    @Prop({ default: false, type: Boolean }) private value!: boolean;

    private get editMode (): boolean { return this.value; }
    private set editMode (val: boolean) { this.$emit('input', val); }
}
</script>

<style lang="scss" scoped>
.grad-editable-field {
    position: relative;
    min-height: 1rem;

    &__overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: rgba(black, 0.3);
        display: none;
        justify-content: center;
        align-items: center;
        font-family: 'Material Icons';
        font-size: 1.5rem;
        color: white;
        cursor: pointer;
        margin: -.5rem;
        border-radius: .5rem;

        &:before {
            content: "edit";
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

    &:hover > #{&}__overlay {
        display: flex;
    }
}
</style>
