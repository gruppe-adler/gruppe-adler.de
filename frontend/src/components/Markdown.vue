<template>
    <div v-html="renderedHTML"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';

const md = MarkdownIt({ html: true });

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

// eslint-disable-next-line @typescript-eslint/camelcase
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

@Component
export default class MarkdownVue extends Vue {
    @Prop({ required: true, type: String }) private md!: string;

    private get renderedHTML (): string {
        return md.render(this.md, {});
    }
}
</script>
