<template>
    <div class="edit-overlay" :style="textFields ? 'z-index: 2;' : undefined">
        <div class="edit-overlay__size">
            <Tooltip text="Kleine Größe">
                <i 
                    :class="['material-icons', item.size === 3 ? 'edit-overlay__size--selected' : '', 'edit-overlay__size--large' ]"
                    @click="changeSize(3)"
                >
                    photo_size_select_small
                </i>
            </Tooltip>
            <Tooltip text="Mittlere Größe">
                <i 
                    :class="['material-icons', item.size === 2 ? 'edit-overlay__size--selected' : '', 'edit-overlay__size--medium' ]"
                    @click="changeSize(2)"
                >
                    photo_size_select_large
                </i>
            </Tooltip>
            <Tooltip text="Große Größe">
                <i
                    :class="['material-icons', item.size === 1 ? 'edit-overlay__size--selected' : '', 'edit-overlay__size--small' ]"
                    @click="changeSize(1)"
                >
                    photo_size_select_actual
                </i>
            </Tooltip>
        </div>
        <div v-if="textFields" class="edit-overlay__text-fields">
            <i class="material-icons" style="background-color: #2F80ED;">text_fields</i>
            <div></div> <!-- Triangle at the top -->
            <div @click.stop ref="textFieldsWrapper">
                <input type="text" placeholder="Titel" v-model="item.title" />
                <input type="text" placeholder="Autor" v-model="item.author" />
            </div>
        </div>
        <Tooltip text="Titel / Autor bearbeiten" v-else>
            <i class="material-icons" @click="textFields = true;">text_fields</i>
        </Tooltip>
        <Tooltip text="Löschen">
            <i class="material-icons" style="background-color: #8F1167;" @click.stop="$emit('delete', $event)">delete</i>
        </Tooltip>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { GalleryItem } from '@/models/gallery/GalleryItem';
import EditOverlayVue from './EditOverlay.vue';

@Component({
    components: {
        EditOverlay: EditOverlayVue
    }
})
export default class GalleryItemEditOverlayVue extends Vue {
    @Prop({ default: null }) private value!: GalleryItem|null;

    private textFields: boolean = false;
    private resizeTimeout?: number;
    private clickHandlerAdded: boolean = false;

    private created() {
        window.addEventListener('resize', this.handleResize);
    }

    private beforeDestroy() {
        if (this.clickHandlerAdded) window.removeEventListener('click', this.onWindowClick);
        window.removeEventListener('resize', this.handleResize);
    }

    private handleResize() {
        if (!this.textFields) return;

        if (this.resizeTimeout !== undefined) window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(this.fixTextFieldClipping.bind(this), 100);
    }

    /**
     * @description Adjusts position of text fields to make sure they don't clip over the left side of the screen
     * @author DerZade
     */
    @Watch('textFields')
    private fixTextFieldClipping() {

        if (!this.textFields) {
            if (this.clickHandlerAdded) {
                window.removeEventListener('click', this.onWindowClick);
                this.clickHandlerAdded = false;
            }
            return;
        }

        // try again on the next tick if the text field wrapper isn't rendered atm
        if (!this.$refs.textFieldsWrapper) return this.$nextTick(this.fixTextFieldClipping);

        if (!this.clickHandlerAdded) {
            window.setTimeout(() => {
                window.addEventListener('click', this.onWindowClick);
            }, 50);
            this.clickHandlerAdded = true;
        }

        // find offset from left screen border
        const div = this.$refs.textFieldsWrapper as HTMLDivElement;
        const left = div.getBoundingClientRect().left;

        // make sure the wrapper is a minimum 8px away of the left screen border
        if (left > 8) {
            div.style.marginLeft = null;
        } else {
            const prevMargin = div.style.marginLeft ? Number.parseFloat(div.style.marginLeft) : 0;

            div.style.marginLeft = `${prevMargin + 8 - left}px`;
        }
    }

    /**
     * @description Hide text fields when user clicks somewehre on the screen
     * @author DerZade
     */
    private onWindowClick(event: MouseEvent) {
        if (!this.textFields) return;

        this.textFields = false;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    /**
     * @description Change size of tile
     * @author DerZade
     */
    private changeSize(newSize: 1|2|3) {
        if (!this.item) return;

        this.item.size = newSize;
    }

    // helper functions for v-model
    // just use this.item to access it
    private get item() { return this.value; }
    private set item(item: GalleryItem|null) { this.$emit('input', item); }
}
</script>

<style lang="scss" scoped>
.edit-overlay {
    position: absolute;
    top: 50%;
    left: 0px;
    right: 0px;
    transform: translateY(-50%);
    display: flex;
    flex-wrap: wrap-reverse;
    grid-column-gap: 8px;
    width: 100%;
    user-select: none;
    padding: 20px 0px;
    z-index: 1;
    justify-content: center;

    i {
        height: 40px;
        width: 40px;
        background-color: rgba(0,0,0,0.7);
        color: white;
        border-radius: 50%;
        line-height: 40px;
        vertical-align: center;
        text-align: center;
        margin: 2px 4px;
    }

    &__size {
        display: flex;

        &--small {
            border-top-left-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
            padding-right: 4px;
            margin-left: 0px !important;
        }
        &--medium {
            border-radius: 0px !important;
            margin-left: 0px !important;
            margin-right: 0px !important;
        }
        &--large {
            border-top-right-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
            padding-left: 4px;
            margin-right: 0px !important;
        }

        &--selected {
            color: #313131 !important;
            background-color: white !important;
        }
    }

    &__text-fields {
        position: relative;
        display: flex;
        justify-content: center;

        // weird triangle at the top
        > div:not(:last-child) {
            position: absolute;
            top: calc(100% + 5px);
            width: 20px;
            height: 20px;
            transform: rotate(45deg);
            background-color: black;
            z-index: 0;
        }

        > div:last-child {
            display: flex;
            flex-direction: column;
            align-items: center;


            background-color: black;
            position: absolute;
            top: calc(100% + 10px);
            z-index: 20;
            padding: 6px;
            border-radius: 8px;
            
            input {
                z-index: 2;
                padding: 20px 16px;
                background-color: #333333;
                color: white;
                border: none;
                outline: none;
                font-size: 16px;
                width: 350px;

                &:not(:last-child) {
                    margin-bottom: 8px;
                }
            }
        }
    }

}
</style>