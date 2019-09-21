<template>
    <GalleryItem
        :value="{ type: 'image', size: 1,  position: 0 }"
        :editable="false"
        @click="$emit('click', $event)"
        @delete="$emit('delete', $event)"
    >
        <div class="add-gallery-image">
            <span>Bild hierher ziehen</span>
            <span>oder</span>
            <input type="text" placeholder="Yoututbe URL eingeben">
        </div>
    </GalleryItem>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import GalleryItemVue from './Item.vue';

@Component({
    components: {
        GalleryItem: GalleryItemVue
    }
})
export default class AddGalleryItemVue extends Vue {}
</script>

<style lang="scss" scoped>
.add-gallery-image {
    margin: 32px;
    border: 3px rgba(0,0,0,0.2) dashed;
    border-radius: 16px;
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    > * {
        color: #333333;
        font-size: 16px;
        font-weight: bolder;
        text-align: center;
        padding: 20px;
    }

    input {
        border-radius: 4px;
        background-color: rgba(#999999, 0.4);
        border: none;
        outline: none;
        min-width: 80%;
    }
}
</style>