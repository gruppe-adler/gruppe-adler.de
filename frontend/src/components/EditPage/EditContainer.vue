<template>
    <div class="grad-edit-container">
        <Container
            v-if="values !== null"
            :headerColor="values.headerColor"
        >
            <template v-slot:header>
                <EditableField v-model="editHeading" style="flex-grow: 1;">
                    <template v-slot:edit>
                        <input
                            class="grad-edit-container__heading-text-field"
                            type="text"
                            ref="headingInput"
                            v-model="values.heading"
                            @blur="editHeading = false"
                        />
                    </template>
                    <span>{{values.heading}}</span>
                </EditableField>
                <EditableImage v-model="values.headerImage" style="margin-left: 1rem;" placeholderStyle="height: 45px; border-radius: .5rem; width: 4rem; font-size: 2rem;">
                    <template v-slot:img="{ img }">
                        <img v-lazy-img :data-src="img" alt="preview-image" class="grad-container__header-image">
                    </template>
                </EditableImage>
            </template>
            <template v-slot:image>
                <EditableImage v-model="values.pinnedImage" style="max-height: inherit;" placeholderStyle="min-height: 10rem; margin-top: 72px; font-size: 3rem;">
                    <template v-slot:img="{ img }">
                        <img v-lazy-img :data-src="img" alt="preview-image" style="max-width: 100%">
                    </template>
                </EditableImage>
            </template>
            <template>
                <MarkdownTextField
                    v-model="values.content"
                />
            </template>
            <template v-slot:footer>
                <MarkdownTextField
                    v-model="values.footer"
                />
            </template>
        </Container>
        <div class="grad-edit-container__actions">
            <EditHeaderColor v-model="values.headerColor" />
            <span style="height: 1rem;"></span>
            <ActionButton v-if="saveShown" icon="save" :tooltip="values.new ? 'Container speichern' : 'Änderungen speichern'" color="#66AA66" @click="save" />
            <template v-if="cancelShown">
                <ActionButton icon="cancel" tooltip="Änderungen verwerfen" @click="updateValues" />
                <span style="height: 1rem;"></span>
            </template>
            <div class="grad-edit-container__delete">
                <ActionButton icon="delete" tooltip="Container löschen" color="#8F1167" @click="deletePopup = !deletePopup" />
                <div v-if="deletePopup">
                    <button @click="$emit('delete', container)">Bestätigen</button>
                    <button @click="deletePopup = false">Abbrechen</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import equal from 'fast-deep-equal';

import { Container } from '@/services/page';
import MarkdownTextFieldVue from './MarkdownTextField.vue';
import EditableFieldVue from './EditableField.vue';
import ActionButtonVue from '@/components/ActionButton.vue';
import EditableImageVue from './EditableImage.vue';
import EditHeaderColorVue from './HeaderColor.vue';

@Component({
    components: {
        MarkdownTextField: MarkdownTextFieldVue,
        EditableField: EditableFieldVue,
        ActionButton: ActionButtonVue,
        EditableImage: EditableImageVue,
        EditHeaderColor: EditHeaderColorVue
    }
})
export default class EditContainerVue extends Vue {
    @Prop({ required: true }) private container!: Container;
    private values: Container|null = null;
    private editHeading = false;
    private deletePopup = false;

    private created () {
        this.updateValues();
    }

    @Watch('container', { deep: true })
    private updateValues () {
        this.values = { ...this.container };
    }

    @Watch('editHeading')
    private focusTextField () {
        if (!this.editHeading) return;

        this.$nextTick(() => {
            if (this.$refs.headingInput) {
                (this.$refs.headingInput as HTMLTextAreaElement).focus();
            }
        });
    }

    private get saveShown (): boolean {
        return !equal(this.container, this.values) || this.container.new === true;
    }

    private get cancelShown (): boolean {
        return !equal(this.container, this.values) && this.container.new !== true;
    }

    private save () {
        if (this.values === null) return;

        if (this.values.new === true) {
            this.$emit('save', this.values);
            return;
        }

        const updatedValues: Partial<Container> & Pick<Container, 'id'> = {
            id: this.values.id
        };

        for (const key in this.values) {
            if (Object.prototype.hasOwnProperty.call(this.values, key)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const value = this.values[key];

                if (value === undefined) continue;

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (!Object.prototype.hasOwnProperty.call(this.container, key) || !equal(this.container[key], value)) {
                    // key is not present in original container -> we assume it has to be "updated"
                    // value is not the same as it was on the original container -> it has to be updated
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    updatedValues[key] = value;
                }
            }
        }

        this.$emit('save', updatedValues);
    }
}
</script>

<style lang="scss" scoped>
.grad-edit-container {
    width: 100%;
    position: relative;

    & + & {
        margin-top: 2rem;
    }

    &__actions {
        position: absolute;
        left: calc(100% + .5rem);
        top: 0px;
        bottom: 0px;
        display: grid;
        grid-row-gap: .5rem;
        align-content: flex-start;

    }

    &__delete {
        position: relative;
        display: flex;
        align-items: center;

        > div:nth-child(2) {
            position: absolute;
            left: 100%;
            background-color: #C4C4C4;
            padding: .5rem;
            border-radius: 1rem;
            margin-left: .75rem;
            display: grid;
            grid-row-gap: .5rem;

            > button {
                background-color: white;
                // color: #2F80ED;

                &:hover {
                    background-color: #2F80ED;
                }

                &:first-of-type {
                    color: #8F1167;

                    &:hover {
                        color: white;
                        background-color: #8F1167;
                    }
                }
            }

            &::before {
                background-color: inherit;
                content: '';
                width: 1rem;
                height: 1rem;
                position: absolute;
                left: 0px;
                transform: translate(-50%, -50%) rotate(45deg);
                top: 50%;
            }
        }
    }

    &__heading-text-field {
        text-transform: uppercase;
        font-size: inherit;
        height: 1em;
        line-height: normal;
        font-family: inherit;
        padding: 0.2rem;
        margin-left: -0.2rem;
        margin-top: -0.2rem;
        border: 0px;
        width: 100%;
        background-color: transparent;
        border: none;
        outline: none;
    }

    &__header-image-placeholder {
        background-color: #C4C4C4;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        cursor: pointer;
        position: relative;

        > i {
            position: absolute;
            transition: font-size .1s cubic-bezier(0.455, 0.03, 0.515, 0.955);
            font-size: inherit;
        }

        &:hover > i {
            font-size: 1.2em;
        }
    }

    &__header-color,
    &__header-image-placeholder {
        height: 2rem;
        width: 2rem;
        padding: .5rem;
        font-size: 1.5rem;
        border-radius: 50%;
        margin-left: 1rem;
    }
}
</style>
