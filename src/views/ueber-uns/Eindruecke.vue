<template>
    <Content>
        <ActionButtons v-if="isLoggedIn && items.length > 0">
            <template v-if="editMode">
                <div style="margin-left: auto;"></div>
                <ActionButton icon="close" tooltip="Abbrechen" color="#8F1167" @click="editMode = false" />
                <ActionButton icon="save" tooltip="Speichern" @click="editMode = true" />
            </template>
            <template v-else>
                <ActionButton v-if="!addMode" icon="add" tooltip="Eintrag hinzufügen" @click="addMode = true" />
                <ActionButton v-else icon="close" tooltip="Hinzufügen abbrechen" color="#8F1167" @click="addMode = false" />
                <ActionButton icon="edit" tooltip="Einträge bearbeiten" @click="addMode = false; editMode = true" />
            </template>
        </ActionButtons>
        <div class="gallery-wrapper" ref="galleryWrapper">
            <transition name="add-gallery-item">
                <AddGalleryItem v-if="addMode" />
            </transition>
            <template v-for="(item, index) in items">
                <GalleryImage
                    v-if="item.type === 'image'"
                    :item="item"
                    :editable="editMode"
                    @click="lightboxItem = item"
                    @delete="deleteItem(index)"
                    :key="index"
                />
                <GalleryVideo
                    v-if="item.type === 'video'"
                    :item="item"
                    :editable="editMode"
                    @click="lightboxItem = item"
                    @delete="deleteItem(index)"
                    :key="index"
                />
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';
import ApiService from '@/ApiService';
import GalleryVideoVue from '@/components/Gallery/Video.vue';
import GalleryImageVue from '@/components/Gallery/Image.vue';
import LightboxVue from '@/components/Gallery/Lightbox.vue';
import ActionButtonVue from '@/components/ActionButton.vue';
import ActionButtonsVue from '@/components/ActionButtons.vue';
import AddGalleryItemVue from '@/components/Gallery/AddItem.vue';
import Sortable from 'sortablejs';

@Component({
    components: {
        GalleryImage: GalleryImageVue,
        GalleryVideo: GalleryVideoVue,
        Lightbox: LightboxVue,
        ActionButton: ActionButtonVue,
        AddGalleryItem: AddGalleryItemVue,
        ActionButtons: ActionButtonsVue
    }
})
export default class UeberUnsEindruecke extends Vue {
    private items: GalleryItem[] = [];
    private loadingError: boolean = false;
    private loading: boolean = true;
    private lightboxItem: GalleryItem|null = null;
    private addMode: boolean = false;
    private editMode: boolean = false;
    private originalItems: GalleryItem[] = [];
    private sortable: Sortable|null = null;

    private mounted() {
        this.fetchItems();
    }

    @Watch('editMode')
    private onEditModeChanged() {
        if (this.editMode) {
            this.originalItems = JSON.parse(JSON.stringify(this.items));

            this.sortable = new Sortable(this.$refs.galleryWrapper as HTMLDivElement, {
                ghostClass: 'gallery-item--ghost',
                animation: 100
            });
        } else {
            this.items = [];
            this.$nextTick(() => this.items = this.originalItems);

            if (this.sortable) this.sortable.destroy();
        }
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
        const index = this.items.findIndex(i => i._id === this.lightboxItem!._id);

        const newIndex = (index === 0) ? (this.items.length - 1) : (index - 1);

        this.lightboxItem = this.items[newIndex];
    }

    private onLightboxNext(event: MouseEvent) {
        if (this.lightboxItem === null) return;
        if (this.items.length === 0) return;

        // find index of cur shown item
        const index = this.items.findIndex(i => i._id === this.lightboxItem!._id);

        const newIndex = (index === this.items.length - 1) ? (0) : (index + 1);

        this.lightboxItem = this.items[newIndex];
    }

    /**
     * @description Check if user is logged in
     * @author DerZade
     * @returns {boolean} User logged in?
     */
    private get isLoggedIn(): boolean {
        // @ts-ignore
        return this.$root.isLoggedIn() || false;
    }

    private deleteItem(index: number) {
        this.items.splice(index, 1);
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

.add-gallery-item-enter-active, .add-gallery-item-leave-active {
    transition: all .1s;
}
.add-gallery-item-enter, .add-gallery-item-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    height: 0px;
    margin-bottom: 0px;
}

// Sortable.js ghost element
.gallery-item--ghost {
    opacity: 0.1;
}
</style>
