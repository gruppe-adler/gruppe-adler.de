<template>
<div :class="['gallery-item', `gallery-item--width-${item.size}`, editable ? `gallery-item--editable`: '' ]" @click="editable ? null : $emit('click', $event)">
    <div class="gallery-item__wrapper">
        <div class="gallery-item__image" :style="`background-image: url(${image})`"></div>
        <slot />
        <div class="gallery-item__title-bar" v-if="item.title||item.author">
            <span v-if="item.title" class="gallery-item__title">{{item.title}}</span>
            <span v-if="item.author" class="gallery-item__author">{{item.author}}</span>
        </div>
        <EditOverlay v-if="editable" v-model="item" @delete="$emit('delete', $event)" />
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GalleryItem } from '@/services/gallery';
import EditOverlayVue from './EditOverlay.vue';

@Component({
    components: {
        EditOverlay: EditOverlayVue
    }
})
export default class GalleryItemVue extends Vue {
    @Prop({ default: null }) private value!: GalleryItem|null;
    @Prop({ default: '' }) private image!: string;
    @Prop({ default: false }) private editable!: boolean;

    private get item () { return this.value; }
    private set item (item: GalleryItem|null) { this.$emit('input', item); }
}
</script>

<style lang="scss" scoped>
.gallery-item {
    cursor: pointer;
    float: left;
    margin-bottom: 2rem;
    margin-left: 2rem;
    border-radius: .5rem;

    transition: all .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);

    &:hover {
        box-shadow: 0 .5rem 5rem rgba(0, 0, 0, 0.5);
    }

    &#{&}--width-1 {
        width: calc(100% - 2rem);
    }

    &#{&}--width-2 {
        width: calc((100% - 4rem) / 2);
    }

    &#{&}--width-3 {
        width: calc((100% - 6rem) / 3);
    }

    &#{&}--width-3 #{&}__title-bar {
        display: none;
    }

    &__wrapper {
        border-radius: inherit;
        box-shadow: 0 .25rem 5rem rgba(0, 0, 0, 0.25);
        background-color: #C4C4C4;
        position: relative;
        width: 100%;
        padding-top: 56.25%;
    }

    &__title-bar,
    &__image {
        border-radius: inherit;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    &__title-bar {
        padding: 2rem;
        display: flex;
        align-items: flex-end;
        top: auto;
        height: 6rem;
        max-height: 50%;
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 40.62%, rgba(0, 0, 0, 0.75) 100%);

        @media (max-width: 650px) {
            display: none;
        }
    }

    &__image {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    &__title {
        color: white;
    }

    &__author {
        margin-left: .5rem;
        color: #C0C0C0;
    }

    &--editable {
        cursor: grab;
    }
}

</style>
