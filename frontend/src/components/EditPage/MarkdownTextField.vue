<template>
    <EditableField v-model="editMode">
        <template v-slot:edit>
            <textarea
                ref ="textArea"
                v-model="md"
                @input="expandToHeigtht"
                @blur="editMode = false"
            ></textarea>
        </template>
        <Markdown :md="md" />
    </EditableField>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import EditableFieldVue from './EditableField.vue';

@Component({
    components: {
        EditableField: EditableFieldVue
    }
})
export default class MarkdownTextFieldVue extends Vue {
    @Prop({ default: '', type: String }) private value!: string;

    private editMode = false;

    private get md (): string { return this.value; }
    private set md (val: string) { this.$emit('input', val); }

    @Watch('editMode')
    private focusTextField () {
        if (!this.editMode) return;

        this.$nextTick(() => {
            if (this.$refs.textArea) {
                (this.$refs.textArea as HTMLTextAreaElement).focus();
                this.expandToHeigtht();
            }
        });
    }

    private expandToHeigtht () {
        if (!this.$refs.textArea) return;

        const textarea = this.$refs.textArea as HTMLTextAreaElement;

        textarea.style.height = '';

        textarea.style.height = `${textarea.scrollHeight}px`;
    }
}
</script>

<style lang="scss" scoped>
textarea {
    width: 100%;
    font-size: 1rem;
    min-height: 5em;
    height: auto;
    outline: none;
    background-color: transparent;
    border: none;
}
</style>
