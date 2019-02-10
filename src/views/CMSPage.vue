<template>
    <Content v-if="page">
        <template v-if="page.left" v-slot:left>
            <div v-html="page.left"></div>
        </template>
        <template>
            <Container 
                v-for="c in page.containers"
                :key="c.id"
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
        <template v-if="page.right" v-slot:right>
            <div v-html="page.right"></div>
        </template>
    </Content>
    <Content v-else>
        <Spinner />
    </Content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Container } from '@/models/Container';
import { CMSPage } from '@/models/CMSPage';
import ApiService from '@/ApiService';
import Spinner from '@/components/Spinner.vue';

@Component({
    components: { Spinner }
})
export default class CMSPageVue extends Vue {
    private page: CMSPage | null = null;

    private mounted() {
        this.fetchPageData();
    }

    @Watch('$route')
    private routeChanged(to: any) {
        this.fetchPageData();
    }

    private fetchPageData() {
        this.page = null;
        ApiService.getPage(this.$route.path).then(res => {
            this.page = res;
        });
    }
}
</script>
