<template>
<Content>
    <div class="gallery-wrapper">
        <gallery-item v-for="(i, index) in items" :key="index" :size="i" />
    </div>
</Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GalleryItemVue from '@/components/Gallery/Item.vue';

@Component({
    components: {
        GalleryItem: GalleryItemVue
    }
})
export default class UeberUnsEindruecke extends Vue {
    private items: number[] = [];

    private mounted() {
        for (let i = 0; i < 40; i++) {
            this.items.push(Math.floor(Math.random() * 3 + 1));
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    // we need extra 35px on the left side to compensate the 35px left margin of all tiles
    width: calc(100% + 35px);
    margin-left: -35px;
}
</style>
