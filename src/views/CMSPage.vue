<template>
    <Content v-if="page">
        <template v-if="page.toc" v-slot:left>
            <TableOfContents :containers="page.containers" />
        </template>
        <template>
            <Container 
                v-for="c in page.containers"
                :key="c.id"
                :id="`grad-container-${c.id}`"
                :headerColor="c.headerColor"
            > 
                <template v-slot:header v-if="c.heading">
                    <span>{{c.heading}}</span>
                    <img 
                        v-if="c.headerImage"
                        class="grad-container__header-image" 
                        :src="c.headerImage"
                    />
                </template>
                <template v-slot:image  v-if="c.pinnedImage">
                    <img :src="c.pinnedImage">
                </template>
                <template v-if="c.content">
                    <div v-html="c.content"></div>
                </template>
                <template v-slot:footer v-if="c.footer">
                    <div v-html="c.footer"></div>
                </template>
            </Container>
        </template>
    </Content>
    <Content v-else>
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Seite etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
        <LoadingIndicator v-else />
    </Content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Container } from '@/models/Container';
import { CMSPage } from '@/models/CMSPage';
import ApiService from '@/ApiService';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import TableOfContents from '@/components/CMSPage/TableOfContents.vue';
import { Route } from 'vue-router';

@Component({
    components: { LoadingIndicator, TableOfContents }
})
export default class CMSPageVue extends Vue {
    private page: CMSPage | null = null;
    private loadingError: boolean = false;

    private mounted() {
        this.fetchPageData();
    }

    @Watch('$route')
    private routeChanged(to: Route, from: Route) {
        if (to.path === from.path) return;

        this.fetchPageData();
    }

    private fetchPageData() {
        this.page = null;
        this.loadingError = false;

        ApiService.getPage(this.$route.path).then(res => {
            this.page = res;
        }).catch(err => {
            console.error(err);
            this.loadingError = true;
        });
    }
}
</script>
