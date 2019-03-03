<template>
    <Container :headerColor="headerColor" class="grad-blog-entry">
        <template v-slot:header>
            <div>
                <span class="grad-blog-entry__date">
                    <slot name="date" />
                </span>
                <h1 class="grad-blog-entry__heading">
                    <slot name="heading" />
                </h1>
            </div>
            <slot name="header" />
            <div>
                <span class="grad-blog-entry__tags">
                    <slot name="tags" />
                </span>
                <span class="grad-blog-entry__author">
                    <slot name="author" />
                </span>
            </div>
        </template>
        <template>
            <slot />
        </template>
        <template v-slot:footer>
            <slot name="footer" />
        </template>
    </Container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BlogEntry extends Vue {
    @Prop() private headerColor?: string;
}

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
export function parseDate(date: Date): string {
    const addZero = (num: number): string => {
        return `${num < 10 ? '0' : ''}${num}`;
    };

    return `${DAYS[date.getDay()]}, ${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()}`;
}

</script>


<style lang="scss">
.grad-blog-entry {

    .grad-container__header {
        > div {
            display: flex;

            &:first-child {
                flex-direction: column;
            }
        }
    }

    &__date {
        font-family: 'Source Sans Pro', sans-serif;
        opacity: 0.7;
        font-size: 0.58em;
        font-weight: bold;
    }
    &__heading {
        font-size: 1em;
        font-weight: normal;
        margin: 0 0;
    }
    &__tags {
        display: flex;
        align-items: center;

        > span {
            border-radius: 20px;
            font-size: 0.67em;
            padding: 5px 10px;
            text-transform: none;
            display: flex;
            height: 36px;
            box-sizing: border-box;
            align-items: center;
            background-color: rgba(0,0,0,0.2);
            font-family: 'Source Sans Pro', sans-serif;
            color: white;

            & ~ * {
                margin-left: 8px;
            }
        }
    }

    &__author {
        align-items: center;
        display: flex;
        margin-left: 10px;
        img {
            border-radius: 50%;
            height: 36px;
            width: 36px;
        }
    }

    // .grad-container__content {
    //     margin-top: 18px;
    // }
}
</style>
