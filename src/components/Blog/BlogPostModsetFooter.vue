<template>
    <div>
        <div v-if="model.hint" class="grad-modset-blogpost__hint">
            <i class="material-icons">info</i>
            <span>{{model.hint}}</span>
        </div>
        <div class="grad-modset-blogpost__changes">
            <template v-for="(change, index) in model.changes">
                <i :key="`${index}_icon`" v-if="isAdded(change)" class="material-icons" style="color:#66AA66">add_circle</i>
                <i :key="`${index}_icon`" v-if="isUpdated(change)" class="material-icons" style="color:#D18D1F">sync</i>
                <i :key="`${index}_icon`" v-if="isRemoved(change)" class="material-icons" style="color:#C00C0C">remove_circle</i>
                <span :key="`${index}_name`">{{change.name}}</span>
                <span :key="`${index}_size`">{{change.size}}</span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BlogPostModset, BlogPostModsetChange, BlogPostModsetChangeType } from '@/models/blog/BlogPostModset';

@Component
export default class BlogPostModsetFooterVue extends Vue {
    @Prop() private model?: BlogPostModset;

    private isAdded(change: BlogPostModsetChange): boolean {
        return change.type === BlogPostModsetChangeType.added;
    }
    private isUpdated(change: BlogPostModsetChange): boolean {
        return change.type === BlogPostModsetChangeType.updated;
    }
    private isRemoved(change: BlogPostModsetChange): boolean {
        return change.type === BlogPostModsetChangeType.removed;
    }
}
</script>

<style lang="scss" scoped>
.grad-modset-blogpost {
    &__hint {
        color: #8F1167;
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-bottom: 40px;

        .material-icons {
            margin-right: 10px;
        }
    }

    &__changes {
        display: grid;
        grid-template-columns: auto auto auto;
        column-gap: 10px;
        row-gap: 15px;

        :nth-child(3n) {
            margin-left: 20px;
        }
    }
}

</style>