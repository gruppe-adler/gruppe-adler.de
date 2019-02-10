<template>
    <Content v-if="page">
        <template v-slot:left>
            {{page.right}}
        </template>
        <template>
            <Container 
                v-for="c in page.containers"
                :key="c.id"
                :headerColor="c.headerColor"
            > 
                <template v-slot:header v-if="c.header">
                    <span>{{c.header}}</span>
                    <img 
                        v-if="c.headerImage"
                        class="grad-container__header-image" 
                        :src="c.headerImage"
                    />
                </template>
                <template v-slot:image  v-if="c.pinnedImage">
                    <img :src="c.pinnedImage">
                </template>
                <template  v-if="c.content">
                    <div  v-html="c.content"></div>
                </template>
                <template v-slot:footer v-if="c.footer">
                    <div  v-html="c.footer"></div>
                </template>
            </Container>
        </template>
        <template v-slot:right>
            {{page.right}}
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
        // TODO
    }
}
</script>
