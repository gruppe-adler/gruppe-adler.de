<template>
    <div v-html="renderedHTML"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { marked, Renderer } from 'marked';

const renderer = new Renderer();

renderer.link = function (href, title, text) {
    let external = false;

    if (href !== null) {
        try {
            const url = new URL(href, window.location.origin);
            external = (url.host !== window.location.host);
        } catch (err) {
            external = false;
        }
    }

    const titleStr = title === null ? '' : ` title="${title}"`;

    if (external) {
        return `<a target="_blank" rel="noreferrer" href="${href}"${titleStr}>${text}</a>`;
    } else {
        return `<a data-grad-internal-link href="${href}"${titleStr}>${text}</a>`;
    }
};

@Component
export default class MarkdownVue extends Vue {
    @Prop({ required: true, type: String }) private md!: string;

    private get renderedHTML (): string {
        return marked(this.md, { renderer });
    }

    private mounted () {
        this.registerRouterEvenetHandlerToInternalLinks();
    }

    private updated () {
        this.registerRouterEvenetHandlerToInternalLinks();
    }

    /**
     * Called every time component is rendered.
     * Adds click event listener to all internal links (linking to page of gruppe-adler.de),
     * to makes sure we use vue router instead of a complete page reload.
     */
    private registerRouterEvenetHandlerToInternalLinks () {
        const internalLinks = this.$el.querySelectorAll('[data-grad-internal-link]');

        for (const link of Array.from(internalLinks)) {
            link.removeAttribute('data-grad-internal-link');

            const href = link.getAttribute('href');
            if (href === null) continue;

            const url = new URL(href, window.location.origin);
            const path = `${url.pathname}${url.search}`;

            link.addEventListener('click', e => { e.preventDefault(); this.$router.push(path); });
        }
    }
}
</script>
