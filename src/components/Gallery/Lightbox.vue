<template>
<div class="grad-lightbox" @click.self="$emit('close', $event)">
    <div class="grad-lightbox__wrapper">
        <template v-if="item">
            <img class="grad-lightbox__img" :src="imageUrl" />
            <i
                v-if="item.type === 'video'"
                class="material-icons grad-lightbox__video"
                @click="playVideo"
            >
                play_arrow
            </i>
            <div class="grad-lightbox__title-bar" v-if="item.title||item.author">
                <span v-if="item.title" class="grad-lightbox__title">{{item.title}}</span>
                <span v-if="item.author" class="grad-lightbox__author">{{item.author}}</span>
            </div>
            <iframe
                class="grad-lightbox__player"
                v-if="isVideoPlaying"
                :src="`https://www.youtube.com/embed/${item.videoUrl}`"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </template>
    </div>
    <i class="material-icons grad-lightbox__prev" @click="$emit('prev', $event)">arrow_back_ios</i>
    <i class="material-icons grad-lightbox__next" @click="$emit('next', $event)">arrow_forward_ios</i>    
    <i class="material-icons grad-lightbox__close" @click="$emit('close', $event)">close</i>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';
import { GalleryImage } from '@/models/gallery/GalleryImage';
import { GalleryVideo } from '@/models/gallery/GalleryVideo';

@Component
export default class LigthboxVue extends Vue {
    @Prop({ default: null }) private item!: GalleryItem|null;

    private isVideoPlaying: boolean = false;

    @Watch('item')
    private resetIFrame() {
        this.isVideoPlaying = false;
    }

    get imageUrl(): string {
        if (!this.item) return '';

        if (this.item.type === 'image') return (this.item as GalleryImage).image;
        if (this.item.type === 'video') return `https://i.ytimg.com/vi/${(this.item as GalleryVideo).videoUrl}/hqdefault.jpg`;

        return '';
    }

    private playVideo() {
        this.isVideoPlaying = true;
    }
}
</script>

<style lang="scss" scoped>
.grad-lightbox {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0,0,0,0.8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    &__wrapper {
        margin: 10px;
        overflow: hidden;

        display: flex;
        align-items: center;
        position: relative;

    }

    &__img {
        max-width: calc(100vw - 80px);
        max-height: calc(100vh - 80px);
        background-color: #C4C4C4;
    }

    &__close {
        position: absolute;
        top: 0px;
        right: 0px;
    }

    &__next {
        position: absolute;
        right: 0px;
    }

    &__prev {
        position: absolute;
        left: 0px;
    }

    &__video {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    &__player {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
    }

    &__title-bar {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;

        padding: 30px;
        display: flex;
        align-items: flex-end;
        top: auto;
        height: 100px;
        max-height: 50%;
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 40.62%, rgba(0, 0, 0, 0.75) 100%);
    }

    &__title {
        color: white;
    }

    &__author {
        margin-left: 10px;
        color: #C0C0C0;
    }

    i {
        padding: 25px;
        margin: 10px;
        color: white;
        background-color: rgba(0,0,0,0.7);
        border-radius: 50%;
        cursor: pointer;
        transition: all .2s cubic-bezier(0.19, 1, 0.22, 1);
        user-select: none;
    }

    i:hover {
        background-color: rgba(255,255,255,.25);
        color: #000;
        transition: all .2s cubic-bezier(0.19, 1, 0.22, 1);
    }

    i:active {
        background-color: rgba(255,255,255,.5);
        color: #000;
        transition: all .2s cubic-bezier(0.19, 1, 0.22, 1);
    }
}
</style>
