<template>
    <GalleryItem
        v-model="item"
        :image="imageUrl"
        :editable="editable"
        @click="$emit('click', $event)"
        @delete="$emit('delete', $event)"
    />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GalleryImage } from '@/services/gallery';
import GalleryItemVue from './Item.vue';

@Component({
    components: {
        GalleryItem: GalleryItemVue
    }
})
export default class GalleryImageVue extends Vue {
    @Prop({ default: null }) private item!: GalleryImage|null;
    @Prop({ default: false }) private editable!: boolean;

    private get imageUrl () {
        if (!this.item) return '';
        return this.item.image;
    }
}
</script>
