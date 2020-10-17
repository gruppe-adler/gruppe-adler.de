<template>
    <Loader v-if="loading" />
    <Container v-else headerColor="#2C2C2C" style="background-color: #2C2C2C; margin-bottom: 2rem;">
        <div :class="{'grad-arma-events': true,  'grad-arma-events--small': small }" :style="expanded ? 'max-height: 2000px;' : ''" ref="list" @scroll="onContainerScroll">
            <div v-for="(event, i) in events" :key="i" :class="{'grad-arma-event': true, 'grad-arma-event--future': isInFuture(event) }">
                <span class="grad-arma-event__date">{{formatDate(event.date)}}</span>
                <span class="grad-arma-event__title">{{event.title}}</span>
                <div class="grad-arma-event__attendance">
                    <div>
                        <div v-for="i in event.attendance[0]" :key="`firm_${i}`" class="grad-arma-event__attendance-firm"></div>
                        <div v-for="i in event.attendance[1]" :key="i" class="grad-arma-event__attendance-maybe"></div>
                    </div>
                    <span>{{event.attendance[0]}} - {{event.attendance[0] + event.attendance[1]}} Zusagen</span>
                </div>
                <a class="grad-arma-event__button" @click="openEvent(event)">
                    <i class="material-icons">launch</i>
                </a>
            </div>
            <i v-if="small && !hasScrolled" class="grad-arma-events__arrow material-icons">chevron_right</i>
        </div>
        <div v-if="error" style="display: flex; flex-direction: column; align-items: center;">
            <span style="margin-bottom: 1rem;">Bein Laden der Events ist ein Fehler aufgetreten.</span>
            <button @click="load">Erneut Versuchen</button>
        </div>
        <a
            v-if="expanded || small"
            class="grad-arma-events__more"
            href="https://forum.gruppe-adler.de/category/3"
            target="_blank"
            rel="noreferrer"
        >
            Mehr Events im Forum
        </a>
        <span v-else class="grad-arma-events__more" @click="expanded = true">Mehr anzeigen</span>
    </Container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fetchEvents, ArmaEvent, isInFuture } from '@/services/events';

const padNum = (num: number) => `${num}`.padStart(2, '0');
const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

@Component
export default class Events extends Vue {
    private loading = true;
    private error = false;
    private hasScrolled = false;
    private events: ArmaEvent[] = [];
    private expanded = false;
    private small = true;
    private resizeObserver: null|ResizeObserver = null;

    private created () {
        this.load();
        this.resizeObserver = new ResizeObserver(() => {
            const list = this.$refs.list as HTMLDivElement|undefined;
            if (!list) return;

            const { width } = list.getBoundingClientRect();

            this.small = width < 580;
        });
    }

    private mounted () {
        const list = this.$refs.list;
        if (!list || !this.resizeObserver) return;
        this.resizeObserver.observe(list as HTMLDivElement);
    }

    private updated () {
        const list = this.$refs.list;
        if (!list || !this.resizeObserver) return;
        this.resizeObserver.observe(list as HTMLDivElement);
    }

    private beforeDestory () {
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    private async load () {
        this.loading = true;
        this.error = false;

        try {
            this.events = await fetchEvents();
        } catch (err) {
            console.error(err);
            this.error = true;
        }

        this.loading = false;
    }

    /**
     * Open thread of given event in new tab
     * @param {ArmaEvent} event Event to open
     */
    private openEvent (event: ArmaEvent) {
        const win = window.open(event.url, '_blank');
        if (win === null) return;
        win.focus();
    }

    /**
     * Format date
     * @param {Date} data Date to format
     * @returns {string} formatted Date
     */
    private formatDate (date: Date): string {
        return `${weekDays[date.getDay()]}, ${padNum(date.getDate())}.${padNum(date.getMonth() + 1)}`;
    }

    /**
     * Checks wether event is in future
     * @param {ArmaEvent} event
     */
    private isInFuture (event: ArmaEvent): boolean {
        return isInFuture(event.date);
    }

    private onContainerScroll () {
        this.hasScrolled = true;
    }
}

</script>

<style lang="scss" scoped>
button {
    background-color: #666666;
    color: white;
    font-weight: normal;

    &:hover {
        background-color: #66AA66;
    }
}

.grad-arma-events {
    // 3 * event height + 2 * margin between events
    max-height: 3 * 5.75rem + 2 * 0.5rem;
    overflow: hidden;
    transition: all .4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    margin-top: -1.125rem;
    margin-left: -2.25rem;
    width: calc(100% + 4.5rem);
    position: relative;
    border-radius: .25rem;

    &__more {
        display: block;
        text-align: center;
        margin-top: .5rem;
        color: inherit;
        font-weight: normal;
        cursor: pointer;
        transition: all .05s cubic-bezier(0.455, 0.03, 0.515, 0.955);

        &:hover {
            color: white;
            text-decoration: underline;
        }
    }

    &__arrow {
        font-size: 2.5rem;
        position: absolute;
        color: white;
        pointer-events: none;
        right: -0.5rem;
        top: 50%;
        transform: translateY(-50%);
        animation: listArrow 5s ease-in-out infinite;
        opacity: 0.7;
    }

    @keyframes listArrow {
        0% { right: -0.5rem; opacity: 0; }
        10% { right: -0.5rem; opacity: 0.7; }
        20% { right: -0.75rem; opacity: 0; }
        100% { right: -0.5rem; opacity: 0; }
    }

    &#{&}--small {
        display: flex;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        padding-bottom: 1rem;
    }
}
</style>

<style lang="scss" scoped>
$baseClass: '.grad-arma-event';

#{$baseClass} {
    display: grid;
    grid-template-columns: 4em .6fr .4fr auto;
    grid-column-gap: 2rem;
    align-items: center;
    padding: 1rem 2rem;
    box-sizing: border-box;
    color: rgba(white, 0.5);
    font-size: 1rem;
    height: 5.75rem;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;

    & + & {
        margin-top: .5rem;
    }

    &__title {
        font-size: 1.125rem;
        font-weight: bold;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
    }

    &__attendance {
        color: rgba(#C4C4C4, 0.5);

        &-maybe,
        &-firm {
            width: .5rem;
            height: .5rem;
            margin: .1rem;
            border-radius: 50%;
        }

        &-firm {
            background-color: #66AA66;
        }

        &-maybe {
            background-color: #999;
        }

        > div {
            display: flex;
            flex-wrap: wrap;
        }
    }

    &:hover &__button  {
        opacity: 1;
    }

    &__button {
        transition: all .1s ease-in-out;
        justify-self: flex-end;
        color: #999;
        opacity: 0.1;
        cursor: pointer;

        &:hover {
            color: #999;
        }
    }

}

// Active Event
#{$baseClass}#{$baseClass}--future {
    color: rgba(white, 1);
    border-left-color: #66AA66;
    border-bottom: 1px solid #404040;

    #{$baseClass}__attendance {
        color: inherit;
    }
}

.grad-arma-events--small #{$baseClass} {
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto auto;
    margin-top: 0;
    width: calc((100% - 1rem) / 2);
    scroll-snap-align: start;
    margin-right: 1rem;
    flex-shrink: 0;

    #{$baseClass}__title {
        align-self: flex-start;
    }

    #{$baseClass}__attendance {
        margin: 1rem 0;
    }

    #{$baseClass}__button {
        justify-self: initial;
    }
}

::-webkit-scrollbar {
    width: 0;
    height: 0;
}
::-webkit-scrollbar-track {
    background: rgba(#666666, 0.2);
    border-radius: .25rem;
}
::-webkit-scrollbar-thumb {
    background: rgba(#666666, 0.5);
    border-radius: .25rem;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(#666666, 1);
}
</style>
