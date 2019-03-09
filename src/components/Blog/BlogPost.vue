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
}
</script>

<style lang="scss">
.grad-blogpost {
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
}
</style>
