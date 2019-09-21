<template>
    <BlogEntry 
        :id="`grad-blogpost-${model.id}`"
        :class="['grad-blogpost', `grad-blogpost--${model.type}`]"
    > 
        <template v-slot:date>{{date}}</template>
        <template v-slot:heading>{{model.heading}}</template>
        <template v-slot:tags><span v-for="t in model.tags" :key="t">{{t}}</span></template>
        <template v-slot:author><img :src="model.author.picture" /></template>
        <template v-slot:image v-if="model.pinnedImage">
            <img :src="model.pinnedImage" alt="pinned-image">
        </template>
        <template>
            <div v-html="model.content"></div>
        </template>
        <template v-slot:footer v-if="footerComponent">
            <component :is="footerComponent" :model="model"></component>
        </template>
        <div class="grad-blogpost__draft-overlay" v-if="!model.published">
            <span>Entwurf</span>
        </div>
        <div class="grad-blogpost__edit-overlay" v-if="isLoggedIn">
            <span @click="editPost">Editieren</span>
        </div>
    </BlogEntry>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BlogPost } from '@/models/blog/BlogPost';
import BlogEntryVue, { parseDate } from './BlogEntry.vue';
import EventFooterVue from './BlogPostEventFooter.vue';
import ModsetFooterVue from './BlogPostModsetFooter.vue';
import { EVENT_REPORT_TYPE } from '@/models/blog/BlogPostEvent';
import { MOD_UPDATE_TYPE } from '@/models/blog/BlogPostModset';

@Component({
    components: {
        BlogEntry: BlogEntryVue,
        BlogPostEventFooter: EventFooterVue,
        BlogPostModsetFooter: ModsetFooterVue
    }
})
export default class BlogPostVue extends Vue {
    @Prop() private model?: BlogPost;
    @Prop({ default: false }) private isLoggedIn!: boolean;

    private get date(): string {
        if (!this.model) return '';

        return parseDate(this.model.date);
    }

    private get footerComponent(): string | null {
        if (!this.model) return null;
        if (this.model.type === EVENT_REPORT_TYPE) return 'BlogPostEventFooter';
        if (this.model.type === MOD_UPDATE_TYPE) return 'BlogPostModsetFooter';
        return null;
    }

    private editPost() {
        if (!this.model) return;

        console.log('edit', this.model);
        // TODO
    }
}
</script>

<style lang="scss">
.grad-blogpost {
    position: relative;

    &--modset {
        .grad-container__header {
            background-color: #8F1167;
            color: white;
        }
    }

    &--event {
        .grad-blog-entry__date {
            color: #D18D1F;
            opacity: 1;
        }
        .grad-container__header {
            background-color: rgba(0,0,0,0.7);
            color: white;
        }
    }

    &__edit-overlay,
    &__draft-overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0,0,0,0.3);
        z-index: 1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
        opacity: 1;

        > span {
            display: inline-block;
            background-color: rgba(0,0,0,0.8);
            border-radius: 20px;
            height: 40px;
            line-height: 40px;
            padding: 0px 20px;
            vertical-align: center;
            color: white;
            cursor: pointer;
        }
    }

    &__edit-overlay {
        opacity: 0;
    }

    &:hover &__edit-overlay {
        opacity: 1;
    }

    &:hover &__draft-overlay {
        opacity: 0;
    }
}
</style>
