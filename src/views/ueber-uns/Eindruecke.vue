<template>
<Content>
    <div class="gallery-wrapper">   
        <template v-for="(i, index) in items">
            <GalleryImage v-if="i.type === 'image'" :key="index" :item="i" />
            <GalleryVideo v-if="i.type === 'video'" :key="index" :item="i" />
        </template>
    </div>
</Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';
import ApiService from '@/ApiService';
import GalleryVideoVue from '@/components/Gallery/Video.vue';
import GalleryImageVue from '@/components/Gallery/Image.vue';

@Component({
    components: {
        GalleryImage: GalleryImageVue,
        GalleryVideo: GalleryVideoVue
    }
})
export default class UeberUnsEindruecke extends Vue {
    private items: GalleryItem[] = [];
    private loadingError: boolean = false;
    private loading: boolean = true;

    private mounted() {
        this.fetchItems();
    }

    /**
     * @description Fetches gallery data (incl. images and videos)
     * @author DerZade
     */
    private async fetchItems() {
        this.items = [];
        this.loadingError = false;

        try {
            this.items = await ApiService.getGalleryItems();
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    // we need extra 35px on the left side to compensate the 35px left margin of all tiles
    width: calc(100% + 35px);
    margin-left: -35px;
}
</style>
