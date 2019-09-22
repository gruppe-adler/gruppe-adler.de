<template>
    <GalleryItem
        :value="{ type: 'image', size: 1,  position: 0 }"
        :editable="false"
        @click="$emit('click', $event)"
        @delete="$emit('delete', $event)"
    >
        <div :class="['add-gallery-image']">
            <template v-if="url.length === 0">
                <span >Bild hierher ziehen</span>
                <span>oder</span>
            </template>
            <div>
                <input type="text" placeholder="Yoututbe URL eingeben" v-model="url">
                <button v-if="url.length > 0">Fertig</button>
            </div>
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
export default class AddGalleryItemVue extends Vue {
    private url: string = '';

}
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

    span, input {
        color: #333333;
        font-size: 16px;
        font-weight: bolder;
        text-align: center;
        padding: 20px;
    }

    input {
        border-radius: 4px;
        border: none;
        background-color: white;
        outline: none;
        width: 100%;
        box-sizing: border-box;
        transition: background-color 0.1s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }

    input:only-child {
        background-color: rgba(#999999, 0.4);
    }

    > div {
        min-width: 80%;
        position: relative;
    }

    button {
        position: absolute;
        top: 0px;
        bottom: 0px;
        right: 0px;
        margin: 5px;
        height: calc(100% - 10px);
        background-color: #2F80ED;
        color: white;
        border-radius: 4px;
        width: 100px;
    }
}
</style>