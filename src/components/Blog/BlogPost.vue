<template>
    <Container 
        :id="`grad-blogpost-${model.id}`"
        :class="['grad-blogpost', `grad-blogpost--${model.type}`]"
    > 
        <template v-slot:header>
            <span>{{model.date}}</span>
            <span>{{model.heading}}</span>
        </template>
        <template v-slot:image  v-if="c.pinnedImage">
            <img :src="model.pinnedImage" alt="pinned-image">
        </template>
        <template>
            <div v-html="model.content"></div>
        </template>
        <template v-slot:footer v-if="model.footer">
            <div v-html="model.footer"></div>
        </template>
    </Container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BlogPost } from '@/models/blog/BlogPost';

@Component
export default class BlogpostVue extends Vue {
    @Prop() private model?: BlogPost;
}
</script>

<style lang="scss" scoped>
</style>
