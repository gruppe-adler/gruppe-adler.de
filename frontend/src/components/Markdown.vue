<template>
    <div v-html="renderedHTML"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';

@Component
export default class MarkdownVue extends Vue {
    @Prop({ required: true, type: String }) private md!: string;

    private get renderedHTML (): string {
        return MarkdownIt({ html: true }).render(this.md, {});
    }
}
</script>
