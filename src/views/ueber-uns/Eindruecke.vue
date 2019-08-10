<template>
    <Content>
        <div class="gallery-wrapper">   
            <template v-for="(item, index) in items">
                <GalleryImage @click="lightboxItem = item" v-if="item.type === 'image'" :key="index" :item="item" />
                <GalleryVideo @click="lightboxItem = item" v-if="item.type === 'video'" :key="index" :item="item" />
            </template>
        </div>
        <Loader v-if="loading && !loadingError" />
        <a v-if="!loading && !loadingError" key="load-more" class="grad-gallery__load-more" @click="fetchItems">Mehr laden</a>
        <Error v-if="loadingError">
            Scheint so als ob beim Laden der Eindrücke etwas schief gelaufen ist.<br />Versuche es in ein paar Sekunden erneut!
        </Error>
        <Lightbox 
            v-if="lightboxItem !== null"
            :item="lightboxItem"
            @close="lightboxItem = null;"
            @prev="onLightboxPrev"
            @next="onLightboxNext"
        />
    </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';
import ApiService from '@/ApiService';
import GalleryVideoVue from '@/components/Gallery/Video.vue';
import GalleryImageVue from '@/components/Gallery/Image.vue';
import LightboxVue from '@/components/Gallery/Lightbox.vue';

@Component({
    components: {
        GalleryImage: GalleryImageVue,
        GalleryVideo: GalleryVideoVue,
        Lightbox: LightboxVue
    }
})
export default class UeberUnsEindruecke extends Vue {
    private items: GalleryItem[] = [];
    private loadingError: boolean = false;
    private loading: boolean = true;
    private lightboxItem: GalleryItem|null = null;

    private mounted() {
        this.fetchItems();
    }

    /**
     * @description Fetches gallery data (incl. images and videos)
     * @author DerZade
     */
    private async fetchItems() {
        this.loadingError = false;
        this.loading = true;

        try {
            const items = await ApiService.getGalleryItems(this.items.length);

            this.items = [...this.items, ...items].sort((x, y) => x.position - y.position);

            this.loading = false;
        } catch (err) {
            console.error(err);
            this.loadingError = true;
        }
    }

    private onLightboxPrev(event: MouseEvent) {
        if (this.lightboxItem === null) return;
        if (this.items.length === 0) return;

        // find index of cur shown item
        const index = this.items.findIndex(i => i.position === this.lightboxItem!.position);

        // item is first item
        if (index === 0) {
            this.lightboxItem = this.items[this.items.length - 1];
            return;
        }

        this.lightboxItem = this.items[index - 1];
    }

    private onLightboxNext(event: MouseEvent) {
        if (this.lightboxItem === null) return;
        if (this.items.length === 0) return;

        // find index of cur shown item
        const index = this.items.findIndex(i => i.position === this.lightboxItem!.position);

        // item is last item
        if (index === this.items.length - 1) {
            this.lightboxItem = this.items[0];
            return;
        }

        this.lightboxItem = this.items[index + 1];

    }
}
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    // we need extra 35px on the left side to compensate the 35px left margin of all tiles
    width: calc(100% + 35px);
    margin-left: -35px;
}

.grad-gallery__load-more {
    cursor: pointer;
    margin-top: 50px;
    font-size: 1.1em;
    font-weight: bold;
    opacity: 0.7;
    color: #D18D1F;

    &:hover {
        opacity: 1;
    }
}
</style>
