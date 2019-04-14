<template>
<Content>
    <BlogEntry 
        :class="['grad-blogpost', `grad-blogpost--${model.type}`]"
    > 
        <template v-slot:date>{{date}}</template>
        <template v-slot:heading>
            <input class="grad-blogpost-write__heading" type="text" v-model="model.heading" />
        </template>
        <template v-slot:tags>
            <span class="grad-blogpost-write__add-tag">+</span>
            <span v-for="t in model.tags" :key="t">{{t}}</span>
        </template>
        <template v-slot:author><img :src="model.author.picture" /></template>
        <template v-slot:image >
            <img v-if="model.pinnedImage" :src="model.pinnedImage" alt="pinned-image">
            <div v-else class="grad-blogpost-write__image-placeholder">
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
    private model: BlogPost = new BlogPost({
        id: 'meh',
        heading: 'meh',
        content: '',
        pinnedImage: '',
        tags: [],
        author: {
            picture: '',
            username: 'meh',
            uid: 3,
            iconBgColor: '#D18D1F',
            iconText: 'U'
        },
        date: new Date(),
        published: true
    });

    private get date() {
        return parseDate(this.model.date);
    }
}
</script>

<style lang="scss" scoped>
.grad-blogpost-write {
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
}
</style>
