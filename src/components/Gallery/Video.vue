<template>
    <GalleryItem
        v-model="item"
        :editable="editable"
        :image="`http://i3.ytimg.com/vi/${item.videoUrl}/maxresdefault.jpg`"
        @click="$emit('click', $event)"
        @delete="$emit('delete', $event)"
    >
        <div class="gallery-video__icon-wrapper">
            <i class="material-icons">play_arrow</i>
        </div>
    </GalleryItem>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GalleryVideo } from '@/models/gallery/GalleryVideo';
import GalleryItemVue from './Item.vue';

@Component({
    components: {
        GalleryItem: GalleryItemVue
    }
})
export default class GalleryVideoVue extends Vue {
    @Prop({ default: null }) private item!: GalleryVideo|null;
    @Prop({ default: false }) private editable!: boolean;
}
</script>

<style lang="scss" scoped>
.gallery-video {
    &__icon-wrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        display: flex;
        justify-content: center;
        align-items: center;

        > i {
            padding: 25px;
            color: white;
            background-color: rgba(0,0,0,0.5);
            border-radius: 50%;
        }
    }
}
</style>
