<template>
    <div class="grad-toc__container" v-if="containers.length > 1">
        <a
            v-for="(c, i) in containers"
            :class="[i == currentId ? 'grad-toc--active' : '']"
            :key="i"
            :href="`#${headingToID(c)}`"
            @click="onLinkClicked($event, headingToID(c))"
        >
            {{c.heading}}
        </a>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Container } from '@/services/page';
import { headingToID } from '@/services/headingToID';

@Component
export default class TableOfContents extends Vue {
    @Prop({ default: () => [], type: Array }) private containers!: Container[];
    private currentId = -1;
    private offset = -120;

    private created () {
        window.addEventListener('scroll', this.handleScroll);

        if (this.$route.hash.length > 0) {
            this.$nextTick(() => {
                this.scrollTo(this.$route.hash.substr(1));
            });
        } else {
            this.$nextTick(() => {
                this.updateCurrentContainer();
            });
        }
    }

    private onLinkClicked (event: MouseEvent, id: string) {
        event.preventDefault();

        const hash = `#${id}`.toLowerCase();
        if (this.$route.hash.toLowerCase() !== hash) this.$router.push({ hash });

        this.scrollTo(id);
    }

    private scrollTo (id: string) {
        const el = document.getElementById(id);
        if (el === null) return;

        const { top } = el.getBoundingClientRect();
        const offsetPosition = top + this.offset + window.scrollY;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }

    private beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * Find the first container which is completely shown and sets it's id as this.currentId
     */
    private handleScroll () {
        this.updateCurrentContainer();
    }

    private updateCurrentContainer () {
        if (!this.containers) return;

        // itereate all containers and find the one first one which is more than 50px from top of screen
        for (let index = 0; index < this.containers.length; index++) {
            const container = document.getElementById(headingToID(this.containers[index].heading));
            if (container) {
                const top = container.getBoundingClientRect().top;

                if (top > 50) {
                    this.currentId = index;
                    return;
                }
            }
        }
    }

    private headingToID (container: Container): string {
        return headingToID(container.heading);
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";
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
            @media (prefers-color-scheme: dark) {
                color: $text-color-tertiary;
            }
        }
    }

    &--active {
        font-weight: bold;
        color: $text-color-primary !important;
    }
}
</style>

<style lang="scss">
body.grad-nav-collapsed .grad-toc__container {
    top: 9rem - 4.5rem; // 4.5rem = navbar height
}
</style>
