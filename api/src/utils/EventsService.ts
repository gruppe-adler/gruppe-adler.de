import * as equals from 'fast-deep-equal';
import fetch from 'node-fetch';

export interface ArmaEvent {
    date: Date;
    title: string;
    url: string;
    attendance: [number, number];
}

export class ArmaEventsService {
    private static readonly ATTENDANCE_PLUGIN_INTRODUCTION = 1483833600000;
    private static readonly FORUM_URI = 'https://forum.gruppe-adler.de';
    private static readonly TOPIC_TITLE_REGEX = /^\d{4}-\d{2}-\d{2}\s*,(\s*\w+\s*,)?\s*/i;

    private static instance: ArmaEventsService|null = null;

    private cachedEvents: ArmaEvent[] = [];
    private lastModified: Date = new Date(0);

    // this constructor is actually important to make sure it is private (singleton pattern)
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        this.cacheEvents();

        // fetch new events every half an hour
        setInterval(this.cacheEvents.bind(this), 1000 * 60 * 30);
    }

    public static getInstance(): ArmaEventsService {
        if (this.instance === null) {
            this.instance = new ArmaEventsService();
        }

        return this.instance;
    }

    public async getEvents(): Promise<{ events: ArmaEvent[], lastModified: Date }> {
        return { events: this.cachedEvents, lastModified: this.lastModified };
    }

    public async cacheEvents(): Promise<void> {
        const events = await this.fetchEvents();

        if (!equals(this.cachedEvents, events)) {
            this.cachedEvents = events;
            this.lastModified = new Date();
        }
    }

    private async fetchEvents(): Promise<ArmaEvent[]> {
        const response = await fetch(`${ArmaEventsService.FORUM_URI}/api/events/cid-3`);
        if (!response.ok) {
            throw new Error(`Error while trying to fetch events. Forum API responded with status code ${response.status}.`);
        }
        const { topics } = await response.json() as { topics: Array<{ slug: string; titleRaw: string; tid: number; deleted: 1|0; timestamp: number }> };

        const rawEvents: Array<Omit<ArmaEvent, 'attendance'> & { tid: number }> = [];
        for (const topic of topics) {
            if (topic.timestamp < ArmaEventsService.ATTENDANCE_PLUGIN_INTRODUCTION) continue;
            if (topic.deleted === 1) {
                console.warn(`Skipping topic ${topic.titleRaw} (ID: ${topic.tid}), because it was deleted`);
                continue;
            }
            if (!ArmaEventsService.TOPIC_TITLE_REGEX.test(topic.titleRaw)) {
                console.warn(`Skipping topic ${topic.titleRaw} (ID: ${topic.tid}), because its title did not match the required pattern.`);
                continue;
            }

            rawEvents.push({
                date: new Date(topic.titleRaw.substr(0, 10)),
                title: topic.titleRaw.replace(ArmaEventsService.TOPIC_TITLE_REGEX, ''),
                url: `${ArmaEventsService.FORUM_URI}/topic/${topic.slug}`,
                tid: topic.tid
            });
        }

        // events sorted with event furthest back in past as first item
        const sortedEvents = rawEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

        // we only want one future event and a max of 10 events;
        // if there is no future event we just want the 10 most recent events
        const firstFutureEvent = sortedEvents.findIndex(e => ArmaEventsService.isInFuture(e.date)) + 1;
        const filteredEvents = sortedEvents.slice(0, firstFutureEvent > 0 ? firstFutureEvent : sortedEvents.length).reverse().slice(0, 10);

        const promises = filteredEvents.map(({ tid, ...rest }) => ArmaEventsService.fetchAttendance(tid).then((attendance): ArmaEvent => ({ ...rest, attendance })));

        return Promise.all(promises);
    }

    /**
     * Checks wether date is considered as "in future"
     * A date is "in future", if the date is in future or the current day. Time is completely ignored
     * @param {Date} date
     * @returns {boolean}
     */
    private static isInFuture (date: Date): boolean {
        const dateCopy = new Date(date.getTime());

        // set to 00:00:00 of next day
        dateCopy.setDate(dateCopy.getDate() + 1);
        dateCopy.setHours(0);
        dateCopy.setMinutes(0);
        dateCopy.setSeconds(0);
        dateCopy.setMilliseconds(0);

        return dateCopy.getTime() > (new Date()).getTime();
    }

    /**
     * Fetch attendance for given topic id
     * @param {number} tid Topic id
     * @returns {[number, number]} [Number of firm commitments, Number of "maybes"]
     */
    private static async fetchAttendance (tid: number): Promise<[number, number]> {
        const response = await fetch(`${ArmaEventsService.FORUM_URI}/api/attendance/${tid}`);

        if (!response.ok) {
            throw new Error(`Error while trying to fetch attendance for topic ${tid}. Forum API responded with status code ${response.status}.`);
        }
        const { attendants } = await response.json() as { attendants: Array<{ probability: 0|0.5|1 }> };

        let firm = 0;
        let maybe = 0;

        for (const { probability } of attendants) {
            if (probability === 0.5) {
                maybe++;
            } else if (probability === 1) {
                firm++;
            }
        }

        return [firm, maybe];
    }
}
