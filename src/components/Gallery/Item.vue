<template>
<div :class="['gallery-item', `gallery-item--width-${item.size}`]"  @click="$emit('click', $event)">
    <div class="gallery-item__wrapper">
        <div class="gallery-item__image" :style="`background-image: url(${image})`">
        </div>
        <slot />
        <div class="gallery-item__title-bar" v-if="item.title||item.author">
            <span v-if="item.title" class="gallery-item__title">{{item.title}}</span>
            <span v-if="item.author" class="gallery-item__author">{{item.author}}</span>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';

@Component
export default class GalleryItemVue extends Vue {
    @Prop({ default: null }) private item!: GalleryItem|null;
    @Prop({ default: '' }) private image!: string;
}
</script>

<style lang="scss" scoped>
.gallery-item {
    cursor: pointer;
    float: left;
    margin-bottom: 35px;
    margin-left: 35px;
    border-radius: 8px;

    transition: all .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    
    &#{&}--width-1 {
        // reset 
        width: calc(100% - 35px);
    }

    &#{&}--width-2 {
        width: calc((100% - 70px) / 2);
    }

    &#{&}--width-3 {
        width: calc((100% - 105px) / 3);
    }

    &#{&}--width-3 #{&}__title-bar {
        display: none;
    }

    &__wrapper {
        border-radius: 8px;
        box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.25);
        background-color: #C4C4C4;
        position: relative;
        width: 100%;
        padding-top: 56.25%;
    }

    &__title-bar,
    &__image {
        border-radius: 8px;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }

    &__title-bar {
        padding: 30px;
        display: flex;
        align-items: flex-end;
        top: auto;
        height: 100px;
        max-height: 50%;
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 40.62%, rgba(0, 0, 0, 0.75) 100%);
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
        margin-left: 10px;
        color: #C0C0C0;
    }

    // &#{&}--width-2 #{&}__title-bar > *,
    // &#{&}--width-3 #{&}__title-bar > * {
    //     display: none
    // }
}

.gallery-item:hover {
    box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.5);
    transition: all .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
</style>
