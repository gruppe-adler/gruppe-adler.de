<template>
    <span>EVENT</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BlogPostEvent } from '@/models/blog/BlogPostEvent';

@Component
export default class BlogPostEventFooterVue extends Vue {
    @Prop() private model?: BlogPostEvent;
}
</script>
