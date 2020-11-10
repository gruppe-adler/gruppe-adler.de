import { fetchJSON } from './utils';

const FORUM_URI = 'https://forum.gruppe-adler.de';

const regex = /^\d{4}-\d{2}-\d{2}\s*,(\s*\w+\s*,)?\s*/i;
const ATTENDANCE_PLUGIN_ITNRODUCTION = 1483833600000;

export interface ArmaEvent {
    date: Date;
    title: string;
    url: string;
    attendance: [number, number];
}

/**
 * Checks wether date is considered as "in future"
 * A date is "in future", if the date is in future or the current day. Time is completely ignored
 * @param {Date} date
 * @returns {boolean}
 */
export function isInFuture (date: Date): boolean {
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
async function fetchAttendance (tid: number): Promise<[number, number]> {
    const response = await fetchJSON(`${FORUM_URI}/api/attendance/${tid}`) as { attendants: Array<{ probability: 0|0.5|1 }> };

    let firm = 0;
    let maybe = 0;

    for (const { probability } of response.attendants) {
        if (probability === 0.5) {
            maybe++;
        } else if (probability === 1) {
            firm++;
        }
    }

    return [firm, maybe];
}

export async function fetchEvents (): Promise<ArmaEvent[]> {
    const rawEvents: Array<Omit<ArmaEvent, 'attendance'> & { tid: number }> = [];

    const response = await fetchJSON(`${FORUM_URI}/api/events/cid-3`) as { topics: Array<{ slug: string; titleRaw: string; tid: number; deleted: 1|0; timestamp: number }> };

    for (const topic of response.topics) {
        if (topic.timestamp < ATTENDANCE_PLUGIN_ITNRODUCTION) continue;
        if (topic.deleted === 1) {
            console.warn(`Skipping topic ${topic.titleRaw} (ID: ${topic.tid}), because it was deleted`);
            continue;
        }
        if (!regex.test(topic.titleRaw)) {
            console.warn(`Skipping topic ${topic.titleRaw} (ID: ${topic.tid}), because its title did not match the required pattern.`);
            continue;
        }

        rawEvents.push({
            date: new Date(topic.titleRaw.substr(0, 10)),
            title: topic.titleRaw.replace(regex, ''),
            url: `${FORUM_URI}/topic/${topic.slug}`,
            tid: topic.tid
        });
    }

    // events sorted with event furthest back in past as first item
    const sortedEvents = rawEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    // we only want one future event and a max of 10 events
    const filteredEvents = sortedEvents.slice(0, sortedEvents.findIndex(e => isInFuture(e.date)) + 1).reverse().slice(0, 10);

    const promises = filteredEvents.map(({ tid, ...rest }) => fetchAttendance(tid).then((attendance): ArmaEvent => ({ ...rest, attendance })));

    return Promise.all(promises);
}
