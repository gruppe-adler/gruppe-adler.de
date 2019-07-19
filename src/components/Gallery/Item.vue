<template>
<div :class="['gallery-item', `gallery-item--width-${size}`]">
    <div class="gallery-item__wrapper">
        <img class="gallery-item__image" src="" />
        <div class="gallery-item__title-bar">
            <span class="gallery-item__title">{{title}}</span>
            <span class="gallery-item__author">{{author}}</span>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class GalleryItemVue extends Vue {
    @Prop({ default: 1 }) private size!: number;

    private author = 'nomisum';
    private title = 'Touchdown at Extract';
}
</script>

<style lang="scss" scoped>
.gallery-item {
    float: left;
    margin-bottom: 35px;

    margin-left: 35px;
    
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

    &__wrapper {
        box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.25);
        background-color: #C4C4C4;
        position: relative;
        width: 100%;
        padding-top: 56.25%;
    }

    &__title-bar,
    &__image {
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

    &__author,
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
</style>
