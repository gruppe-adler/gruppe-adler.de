<template>
    <div class="grad-toc__container">
        <a
            v-for="c in containers"
            :class="[c.id == currentId ? 'grad-toc--active' : '']"
            :key="c.id"
            v-smooth-scroll="{ offset: -120 }"
            :href="`#grad-container-${c.id}`"
        >
            {{c.heading}}
        </a>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Container } from '@/models/Container';

@Component
export default class TableOfContents extends Vue {
    @Prop() private containers?: Container[];
    private currentId: string = '';
    private scrollTimeout: number | null = null;

    private mounted() {
        window.addEventListener('scroll', this.handleScroll);
        this.updateCurrentContainer();
    }

    private beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private handleScroll() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(this.updateCurrentContainer, 200);
    }

    /**
     * Finds the first container which is completely shown and sets it's id as this.currentId
     */
    private updateCurrentContainer() {
        if (! this.containers) return;

        // itereate all containers and find the one first one which is more than 50px from top of screen
        for (const c of this.containers) {
            const container = document.getElementById(`grad-container-${c.id}`);
            if (container) {
                const top = container.getBoundingClientRect().top;

                if (top > 50) {
                    this.currentId = c.id;
                    return;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.grad-toc {

    &__container {
        position: -webkit-sticky;
        position: sticky;
        top: 120px;

        > a + a {
            margin-top: 10px;
        }

        > a {
            display: block;
            cursor: pointer;
        }
    }

    &--active {
        color: black !important;
        font-weight: bold;
    }
}
</style>

