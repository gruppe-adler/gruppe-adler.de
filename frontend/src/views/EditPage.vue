<template>
    <Content v-if="page">
        <ActionButtons>
            <ActionButton icon="add" tooltip="Container hinzufügen" @click="addContainer" />
        </ActionButtons>
        <template>
            <EditContainer
                v-for="(c, i) in page.containers"
                :key="c.id"
                :id="`grad-container-${c.id}`"
                :container="c"
                @save="saveContainer(i, $event)"
                @delete="deleteContainer(i, $event)"
            />
        </template>
        <Snackbar v-model="snackbar" :color="snackbarColor" />
    </Content>
    <Content v-else>
        <!-- If page is still null -->
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Seite etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
        <Loader v-else />
    </Content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

import ActionButtonsVue from '@/components/ActionButtons.vue';
import ActionButtonVue from '@/components/ActionButton.vue';
import TableOfContentsVue from '@/components/Page/TableOfContents.vue';
import EditContainerVue from '@/components/EditPage/EditContainer.vue';
import SnackbarVue from '@/components/EditPage/Snackbar.vue';

import { Page, Container, loadPage, createContainer, updateContainer, createPage, deleteContainer } from '@/services/page';
import ResponseError from '../services/utils/ResponseError';

@Component({
    components: {
        TableOfContents: TableOfContentsVue,
        ActionButtons: ActionButtonsVue,
        ActionButton: ActionButtonVue,
        EditContainer: EditContainerVue,
        Snackbar: SnackbarVue
    }
})
export default class PageVue extends Vue {
    private page: Page|null = null;
    private loadingError = false;
    private newPage = false;
    private snackbar = '';
    private snackbarColor = '#66AA66';

    private created () {
        this.fetchPageData();
    }

    @Watch('$route')
    private routeChanged (to: Route, from: Route) {
        if (to.path === from.path) return;

        this.fetchPageData();
    }

    private addContainer () {
        if (this.page === null) return;

        // generate random id for new container and make sure another container doesn't have it yet
        let id = Math.floor(Math.random() * 10000);
        while (this.page.containers.findIndex(c => c.id === id) > -1) {
            id = Math.floor(Math.random() * 10000);
        }

        // find highest index and add one
        let index = 0;
        if (this.page.containers.length > 0) {
            index = 1 + this.page.containers[this.page.containers.length - 1].index;
        }

        this.page.containers.push({
            id,
            heading: 'Titel hinzufügen...',
            content: 'Inhalt hinzufügen...',
            footer: '',
            headerImage: null,
            pinnedImage: null,
            headerColor: null,
            index,
            new: true,
            pageSlug: this.$route.path.replace(/^\/edit/i, '')
        });

        this.$nextTick(() => {
            const el = document.getElementById(`grad-container-${id}`);
            if (el === null) return;

            el.scrollIntoView({ behavior: 'smooth' });
        });
    }

    private async saveContainer (index: number, newValues: Container) {
        if (this.page === null) return;

        // this a new page so we have to create the page first
        if (this.newPage) {
            let page: Page;

            try {
                page = await createPage(this.page);
            } catch (err) {
                if (err.type === 'ResponseError') {
                    const e = err as ResponseError;

                    this.snackbarColor = 'rgb(201, 17, 6)';
                    this.snackbar = `Beim Speichern des Containers ist ein Fehler aufgetreten (${e.response.status} - ${e.response.statusText})`;
                    return;
                }

                throw err;
            }

            page.containers = this.page.containers;

            this.page = page;
            this.newPage = false;
        }

        let newContainer: Container;

        try {
            if (newValues.new === true) {
                newContainer = await createContainer(newValues);
            } else {
                newContainer = await updateContainer(newValues);
            }
        } catch (err) {
            if (err.type === 'ResponseError') {
                const e = err as ResponseError;

                this.snackbarColor = 'rgb(201, 17, 6)';
                this.snackbar = `Beim Speichern des Containers ist ein Fehler aufgetreten (${e.response.status} - ${e.response.statusText})`;
                return;
            }

            throw err;
        }

        this.page.containers[index] = newContainer;

        this.snackbarColor = '#66AA66';
        this.snackbar = 'Speichern erfolgreich!';
    }

    private async deleteContainer (index: number, container: Container) {
        if (this.page === null) return;

        if (container.new !== true) {
            try {
                await deleteContainer(container.id);
            } catch (err) {
                if (err.type === 'ResponseError') {
                    const e = err as ResponseError;

                    this.snackbarColor = 'rgb(201, 17, 6)';
                    this.snackbar = `Beim Löschen des Containers ist ein Fehler aufgetreten (${e.response.status} - ${e.response.statusText})`;
                    return;
                }

                throw err;
            }

            this.snackbarColor = '#66AA66';
            this.snackbar = 'Löschen erfolgreich!';
        }

        this.page.containers.splice(index, 1);
    }

    /**
     * @description Fetch new cms page data
     * @author DerZade
     */
    private async fetchPageData () {
        this.page = null;
        this.loadingError = false;
        this.newPage = false;

        const slug = this.$route.path.replace(/^\/edit/i, '');

        try {
            this.page = await loadPage(slug);
        } catch (err) {
            if (err.type === 'ResponseError') {
                if (err.response.status === 404) {
                    this.newPage = true;
                    this.page = {
                        slug: slug,
                        toc: true,
                        containers: []
                    };
                    return;
                }
            }

            console.error(err);
            this.loadingError = true;
        }
    }
}
</script>
