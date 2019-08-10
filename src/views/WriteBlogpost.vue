<template>
    <Content>
        <template v-if="model">
            <section class="grad-write-blogpost__type">
                <select>
                    <option class="grad-write-blogpost--type-misc">Allgemein</option>
                    <option class="grad-write-blogpost--type-event">Event</option>
                    <option class="grad-write-blogpost--type-modset">Modset</option>
                </select>
            </section>
            <BlogEntry 
                :class="['grad-blogpost', `grad-blogpost--${model.type}`]"
            > 
                <template v-slot:date>
                    <span class="grad-write-blogpost__date">{{date}}</span>
                </template>
                <template v-slot:heading>
                    <input class="grad-write-blogpost__heading" type="text" v-model="model.heading" />
                </template>
                <template v-slot:tags>
                    <span class="grad-write-blogpost__add-tag">+</span>
                    <span v-for="t in model.tags" :key="t">{{t}}</span>
                </template>
                <template v-slot:author><img :src="model.author.picture" /></template>
                <template v-slot:image >
                    <img v-if="model.pinnedImage" :src="model.pinnedImage" alt="pinned-image">
                    <div v-else class="grad-write-blogpost__image-placeholder">
                        <i class="material-icons">photo</i>
                    </div>
                </template>
                <template>
                    <div v-html="model.content"></div>
                </template>
                <!-- <template v-slot:footer v-if="footerComponent">
                    <component :is="footerComponent" :model="model"></component>
                </template> -->
            </BlogEntry>
            <section class="grad-write-blogpost__bottom-buttons">
                <button @click="publish"><i class="material-icons">publish</i> Veröffentlichen</button>
                <button @click="save"><i class="material-icons">save</i> Speichern</button>
            </section>
        </template>
        <Loader v-else />
    </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BlogEntryVue, { parseDate } from '@/components/Blog/BlogEntry.vue';
import { BlogPost } from '../models/blog/BlogPost';

@Component({
    components: {
        BlogEntry: BlogEntryVue
    }
})
export default class WriteBlogPost extends Vue {
    private model: BlogPost|null = null;

    private mounted() {
        this.model = new BlogPost({
            id: '',
            heading: '',
            content: '',
            pinnedImage: '',
            tags: [],
            author: {
                picture: '',
                username: 'User',
                uid: 3,
                iconBgColor: '#D18D1F',
                iconText: 'U'
            },
            date: new Date(),
            published: false
        });
    }


    private get date() {
        if (! this.model) return '';

        return parseDate(this.model.date);
    }

    /**
     * @description Click callback of save button
     * @author DerZade
     */
    private save() {
        // TODO
    }

    /**
     * @description Click callback of publish button
     * @author DerZade
     */
    private publish() {
        // TODO
    }
}
</script>

<style lang="scss" scoped>
.grad-write-blogpost {
    &__heading {
        font-size: inherit;
        font-family: inherit;
        color: inherit;
        height: 1em;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #CCC;
        outline: none;
        transition: border-bottom-color .15s;

        &:focus {
            border-bottom-color: #D18D1F;
        }
    }

    &__add-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4em;
        width: 36px;
        cursor: pointer;
        color: rgba(255,255,255,0.8);
        transition: font-size .1s, color .1s;

        &:hover {
            color: white;
            font-size: 1.6em;
        }
    }

    &__image-placeholder {
        background-color: #C4C4C4;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 72px;
        cursor: pointer;

        i {
            transition: font-size .1s, color .1s;
            color: #999999;
            font-size: 3em;
        }

        &:hover i {
            font-size: 3.5em;
            color: #777777;
        }
    }

    &__date {
        opacity: 0.8;
        cursor: pointer;
        transition: opacity .1s;

        &:hover {
            opacity: 1;
        }
    }


    &__type,
    &__bottom-buttons {
        display: flex;
        width: 100%;
        justify-content: flex-end;

        > button,
        > select {
            margin: 10px 0px;
        }

        * + * {
            margin-left: 10px !important;
        }
    }
    
    &__type {
        justify-content: flex-start;

        option.grad-write-blogpost--type {
            &-misc {
                background-color: white;
                color: black;   
            }

            &-event {
                background-color: black;
                color: #D18D1F;   
            }

            &-modset {
                background-color: purple;
                color: white
            }
        }
    }
}
</style>
