<template>
    <div class="grad-toc__container" v-if="containers.length > 1">
        <a
            v-for="(c, i) in containers"
            :class="[i == currentId ? 'grad-toc--active' : '']"
            :key="i"
            v-smooth-scroll="{ offset }"
            :href="`#grad-container-${i}`"
        >
            {{c.heading}}
        </a>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Container } from '@/services/page';

@Component
export default class TableOfContents extends Vue {
    @Prop({ default: () => [], type: Array }) private containers!: Container[];
    private currentId = -1;
    private scrollTimeout: number | null = null;
    private offset = -120;

    private mounted () {
        window.addEventListener('scroll', this.handleScroll);
        this.updateCurrentContainer();

        if (this.$route.hash.length > 0) {
            this.$nextTick(() => {
                const el = document.getElementById(this.$route.hash.substr(1));
                if (el === null) return;

                const { top } = el.getBoundingClientRect();
                const offsetPosition = top + this.offset;

                window.scrollTo({ top: offsetPosition });
            });
        }
    }

    private beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private handleScroll () {
        if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(this.updateCurrentContainer, 200);
    }

    /**
     * Find the first container which is completely shown and sets it's id as this.currentId
     */
    private updateCurrentContainer () {
        if (!this.containers) return;

        // itereate all containers and find the one first one which is more than 50px from top of screen
        for (let index = 0; index < this.containers.length; index++) {
            const container = document.getElementById(`grad-container-${index}`);
            if (container) {
                const top = container.getBoundingClientRect().top;

                if (top > 50) {
                    this.currentId = index;
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
        top: 9rem;
        transition: top .25s ease-in-out;

        > a + a {
            margin-top: .5rem;
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

<style lang="scss">
body.grad-nav-collapsed .grad-toc__container {
    top: 9rem - 4.5rem; // 4.5rem = navbar height
}
</style>
