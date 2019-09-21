<template>
    <GalleryItem
        v-model="item"
        :image="item.image"
        :editable="editable"
        @click="$emit('click', $event)"
        @delete="$emit('delete', $event)"
    />
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
    @Prop({ default: false }) private editable!: boolean;
}
</script>
