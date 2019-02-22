<template>
    <Content>
        <Container 
            v-if="c != null"
            :id="`grad-container-${c.id}`"
            :headerColor="c.headerColor"
        > 
            <template v-slot:header v-if="c.heading">
                <span>{{c.heading}}</span>
                <img 
                    v-if="c.headerImage != ''"
                    class="grad-container__header-image" 
                    :src="c.headerImage"
                />
            </template>
            <template v-slot:image  v-if="c.pinnedImage">
                <img :src="c.pinnedImage" alt="pinned-image">
            </template>
            <template v-if="c.content">
                <div v-html="c.content"></div>
            </template>
            <template v-slot:footer v-if="c.footer">
                <div v-html="c.footer"></div>
            </template>
        </Container>
    </Content>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Container } from '@/models/Container';
import ApiService from '@/ApiService';

@Component
export default class TestContainer extends Vue {
    private c: Container | null = null;

    private mounted() {
        window.addEventListener('message', this.onMessage, false);
    }

    private beforeDestroy() {
        window.removeEventListener('message', this.onMessage);
    }

    private onMessage(event: any) {
        this.c = event.data.entry;

        if (this.c === null) return;

        console.log(this.c.headerImage);
        this.c.pinnedImage = ApiService.normalizeImage(this.c.pinnedImage);
        this.c.headerImage = ApiService.normalizeImage(this.c.headerImage);
        console.log(this.c.headerImage);
    }
}
</script>
