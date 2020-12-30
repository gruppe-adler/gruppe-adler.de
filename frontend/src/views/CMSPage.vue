<template>
    <Content v-if="page">
        <ActionButtons v-if="isLoggedIn">
            <ActionButton icon="edit" tooltip="Seite bearbeiten" @click="$router.push(`/edit${$route.path}`)" />
        </ActionButtons>
        <template v-if="page.toc" v-slot:left>
            <TableOfContents :containers="page.containers" />
        </template>
        <template>
            <Container
                v-for="c in page.containers"
                :key="c.id"
                :id="headingToID(c)"
                :headerColor="c.headerColor"
            >
                <template v-slot:header v-if="c.heading">
                    <h1 style="font-size: inherit; font-weight: inherit;">{{c.heading}}</h1>
                    <img
                        v-if="c.headerImage !== null"
                        v-lazy-img
                        class="grad-container__header-image"
                        alt="header-image"
                        aria-hidden="true"
                        :data-src="c.headerImage"
                    />
                </template>
                <template v-slot:image  v-if="c.pinnedImage !== null">
                    <img v-lazy-img :data-src="c.pinnedImage" alt="pinned-image">
                </template>
                <template v-if="c.content">
                    <Markdown :md="c.content" />
                </template>
                <template v-slot:footer v-if="c.footer">
                    <Markdown :md="c.footer" />
                </template>
            </Container>
        </template>
    </Content>
    <Content v-else>
        <!-- If page is still null -->
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Seite etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
        <Error v-else-if="pageNotFound" type="404">
            <ActionButtons v-if="isLoggedIn">
                <ActionButton icon="edit" tooltip="Seite bearbeiten" @click="$router.push(`/edit${$route.path}`)" />
            </ActionButtons>
            <h3>Leider ausgeflogen.</h3>
            <div class="subline">Seite existiert nicht.</div><br/>
            <router-link  to="/" tag="a">
                <button class="grad-back">Zurück zum Anfang</button>
            </router-link>
        </Error>
        <Loader v-else />
    </Content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

import TableOfContentsVue from '@/components/CMSPage/TableOfContents.vue';
import MarkdownVue from '@/components/Markdown.vue';

import { Page, loadPage, Container } from '@/services/page';
import { headingToID } from '@/services/headingToID';

@Component({
    components: {
        TableOfContents: TableOfContentsVue,
        ActionButtons: () => import(
            /* webpackChunkName: "admin", webpackMode: "lazy" */
            '@/components/ActionButtons.vue'
        ),
        ActionButton: () => import(
            /* webpackChunkName: "admin", webpackMode: "lazy" */
            '@/components/ActionButton.vue'
        ),
        Markdown: MarkdownVue
    },
    metaInfo () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.metaInfoMethod();
    }
})
export default class CMSPageVue extends Vue {
    private page: Page|null = null;
    private loadingError = false;
    private pageNotFound = false;

    private created () {
        this.fetchPageData();
    }

    @Watch('$route')
    private routeChanged (to: Route, from: Route) {
        if (to.path === from.path) return;

        this.fetchPageData();
    }

    /**
     * @description Check if user is logged in
     * @author DerZade
     * @returns {boolean} User logged in?
     */
    private get isLoggedIn (): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.$root.isLoggedIn() || false;
    }

    /**
     * @description Fetch new cms page data
     * @author DerZade
     */
    private async fetchPageData () {
        this.page = null;
        this.loadingError = false;
        this.pageNotFound = false;

        try {
            this.page = await loadPage(this.$route.path);
        } catch (err) {
            if (err.type === 'ResponseError') {
                if (err.response.status === 404) {
                    this.pageNotFound = true;
                    return;
                }
            }

            // eslint-disable-next-line no-console
            console.error(err);
            this.loadingError = true;
        }
    }

    private headingToID (container: Container): string {
        return headingToID(container.heading);
    }

    private metaInfoMethod () {
        if (this.page === null) return {};
        if (this.page.containers.length === 0) return {};
        if (this.page.containers.length > 1) return {};

        return {
            title: this.page.containers[0].heading,
            titleTemplate: '%s - Gruppe Adler'
        };
    }
}
</script>
