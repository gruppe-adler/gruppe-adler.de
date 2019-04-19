<template>
<div class="grad-event-blogpost">
    <div v-if="model.participants > 0" class="grad-event-blogpost__participants">
        <p>{{model.participants}} Teilnehmer bei Gruppe Adler
            <span v-if="model.externalParticipants > 0"> und {{model.externalParticipants}} externe Gäste</span>
        </p>
        <div>
            <div v-for="(p, i) in model.participants" :key="`participants-${i}`"></div>
            <div 
                v-for="(p, i) in model.externalParticipants"
                :key="`external-participants-${i}`"
                class="grad-event-blogpost__participants--external"
            ></div>
        </div>
    </div>
    <div v-if="model.images.length + model.videos.length > 0" class="grad-event-blogpost__media">
        <p>Medien</p>
        <div>
            <a 
                v-for="(m, i) in model.images"
                :key="`image-${i}`"
                :href="m.url"
                target="_blank"
                class="grad-event-blogpost__media-item"
            >
                <i class="material-icons">photo_library</i>
                {{m.label}}
            </a>
        </div>
        <div>
            <a
                v-for="(m, i) in model.videos"
                :key="`video-${i}`"
                :href="m.url"
                target="_blank"
                class="grad-event-blogpost__media-item"
            >
                <i class="material-icons">play_circle_filled</i>
                {{m.label}}
            </a>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BlogPostEvent } from '@/models/blog/BlogPostEvent';

@Component
export default class BlogPostEventFooterVue extends Vue {
    @Prop() private model?: BlogPostEvent;
}
</script>

<style lang="scss" scoped>
.grad-event-blogpost {
    font-weight: bold;

    &__participants {
        > p > span {
            font-weight: normal;
        }


        > div {
            display: flex;
            flex-wrap: wrap;
            padding-left: .1em;

            > * {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                overflow: hidden;
                background-color: black;
                margin: 2px;
            }

            .grad-event-blogpost__participants--external {
                opacity: 0.3;
            }
        }
    }

    &__media {
        margin-top: 40px;
        display: flex;
        flex-wrap: wrap;

        > p {
            width: 100%;
        }

        > div {
            width: 50%;
            min-width: 250px;
        }

        &-item {
            display: flex;
            color: #2F80ED;
            margin: 10px 0px;
            cursor: pointer;

            i {
                color: #666666;
                font-size: 1.3em;
                padding-right: .7em;
            }

        }
    }
}
</style>
