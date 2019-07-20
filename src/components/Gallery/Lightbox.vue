<template>
<div class="grad-lightbox" @click.self="$emit('close', $event)">
    <div class="grad-lightbox__wrapper">
        <template v-if="item">
            <img v-if="item.type === 'image'" class="grad-lightbox__img" :src="item.image" />
            <!-- TODO: VIDEO -->
            <img v-else class="grad-lightbox__img" src="" />
        </template>
        <i class="material-icons grad-lightbox__prev" @click="$emit('prev', $event)">arrow_back_ios</i>
        <i class="material-icons grad-lightbox__next" @click="$emit('next', $event)">arrow_forward_ios</i>    
        <i class="material-icons grad-lightbox__close" @click="$emit('close', $event)">close</i>
        <div class="grad-lightbox__title-bar" v-if="item.title||item.author">
            <span v-if="item.title" class="grad-lightbox__title">{{item.title}}</span>
            <span v-if="item.author" class="grad-lightbox__author">{{item.author}}</span>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';

@Component
export default class LigthboxVue extends Vue {
    @Prop({ default: null }) private item!: GalleryItem|null;
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
    z-index: 1001;
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
        min-height: 400px;
        min-width: 400px;
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
        background-color: rgba(0,0,0,0.5);
        border-radius: 50%;
        cursor: pointer;
        transition: all .2s cubic-bezier(0.19, 1, 0.22, 1);
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
