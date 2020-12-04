import { API_URI } from '.';
import { fetchJSON } from './utils';

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

export async function fetchEvents (): Promise<ArmaEvent[]> {
    return fetchJSON<ArmaEvent[]>(`${API_URI}/api/v1/events`);
}
