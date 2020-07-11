<template>
    <GalleryItem
        v-model="item"
        :editable="editable"
        :image="`https://i.ytimg.com/vi/${item.videoUrl}/hqdefault.jpg`"
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
import { GalleryVideo } from '@/services/gallery';
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
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        > i {
            padding: 1.5rem;
            color: white;
            background-color: rgba(0,0,0,0.5);
            border-radius: 50%;

            @media (max-width: 650px) {
                padding: .5rem;
                font-size: 1.25rem;
            }
        }

    }
}
</style>
