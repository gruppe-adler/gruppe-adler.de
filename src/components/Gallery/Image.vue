<template>
    <GalleryItem :item="item" :image="item.image" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GalleryImage } from '@/models/gallery/GalleryImage';
import GalleryItemVue from './Item.vue';

@Component({
    components: {
        GalleryItem: GalleryItemVue
    }
})
export default class GalleryImageVue extends Vue {
    @Prop({ default: null }) private item!: GalleryImage|null;
}
</script>
