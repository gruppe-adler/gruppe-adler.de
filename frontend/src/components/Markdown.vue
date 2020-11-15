<template>
    <div v-html="renderedHTML"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import marked from 'marked';

const renderer = new marked.Renderer();

renderer.link = function (href, title, text) {
    let external = true;

    if (href !== null) {
        try {
            const url = new URL(href);
            external = (url.host !== window.location.host);
        } catch (err) {
            external = false;
        }
    }

    const titleStr = title === null ? '' : ` title="${title}"`;

    if (external) {
        return `<a target="_blank" href="${href}"${titleStr}>${text}</a>`;
    } else {
        return `<a href="${href}"${titleStr}>${text}</a>`;
    }
};

@Component
export default class MarkdownVue extends Vue {
    @Prop({ required: true, type: String }) private md!: string;

    private get renderedHTML (): string {
        return marked(this.md, { renderer });
    }
}
</script>
