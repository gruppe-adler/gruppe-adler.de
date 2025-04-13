import equals from 'fast-deep-equal';
import fetch from 'node-fetch';

export interface ArmaEvent {
    date: Date
    title: string
    url: string
    attendance: [number, number]
}

const QUERY = `
query GetCommunityEventsWithDetails($communityId: UUID!) {
  events(
    where: { community: { id: { eq: $communityId } } }
    first: 50
    order: [
      { date: DESC } # Sort by date in descending order
    ]
  ) {
    nodes {
      id
      title
      slug
      community {
        slug
      }
      date
      attendingUsers: eventUsers(where: { status: { eq: attending } }) {
        totalCount
      }
      potentiallyAttendingUsers: eventUsers(
        where: { status: { eq: potentiallyAttending } }
      ) {
        totalCount
      }
    }
  }
}
`;

interface GetCommunityEventsWithDetailsQuery {
    __typename?: 'Query'
    events?: {
        __typename?: 'EventsConnection'
        nodes?: Array<{
            __typename?: 'Event'
            id: string
            title: string
            slug: string
            date?: string | null
            community: {
                slug: string
            }
            attendingUsers?: {
                __typename?: 'EventUsersConnection'
                totalCount: number
            } | null
            potentiallyAttendingUsers?: {
                __typename?: 'EventUsersConnection'
                totalCount: number
            } | null
        }> | null
    } | null
};

interface GetCommunityEventsWithDetailsQueryVariables {
    communityId: string
};

export class ArmaEventsService {
    private static readonly ARMA_EVENTS_API_URL = 'https://api.arma.events/graphql/';
    private static readonly ARMA_EVENTS_GRUPPE_ADLER_ID = 'f52e5ce0-928d-45a9-9381-6f93015950ee';

    private static instance: ArmaEventsService | null = null;

    private cachedEvents: ArmaEvent[] = [];
    private lastModified: Date = new Date(0);

    // this constructor is actually important to make sure it is private (singleton pattern)
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor () {
        void this.cacheEvents();

        // fetch new events every half an hour
        setInterval(this.cacheEvents.bind(this), 1000 * 60 * 30);
    }

    public static getInstance (): ArmaEventsService {
        if (this.instance === null) {
            this.instance = new ArmaEventsService();
        }

        return this.instance;
    }

    public async getEvents (): Promise<{ events: ArmaEvent[], lastModified: Date }> {
        return { events: this.cachedEvents, lastModified: this.lastModified };
    }

    public async cacheEvents (): Promise<void> {
        const events = await this.fetchEvents();

        if (!equals(this.cachedEvents, events)) {
            this.cachedEvents = events;
            this.lastModified = new Date();
        }
    }

    private async fetchEvents (): Promise<ArmaEvent[]> {
        const variables: GetCommunityEventsWithDetailsQueryVariables = { communityId: ArmaEventsService.ARMA_EVENTS_GRUPPE_ADLER_ID };
        const response = await fetch(ArmaEventsService.ARMA_EVENTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: QUERY, variables })
        });

        if (!response.ok) {
            throw new Error(`Error fetching data from arma.events! Status: ${response.status}`);
        }

        const result = await response.json() as {
            data: GetCommunityEventsWithDetailsQuery
            errors?: any
        };

        if (result.errors) {
            console.error(result.errors);
            throw new Error(`arma.events GraphQL error occurred! Error: ${JSON.stringify(result.errors)}`);
        }

        // Transform the data to fit ArmaEvent interface
        const rawEvents = result.data.events?.nodes?.map((event): ArmaEvent => {
            return {
                date: new Date(event.date ?? 0),
                title: event.title,
                url: `https://arma.events/e/${event.community.slug}/${event.slug}`, // Construct URL using slug
                attendance: [event.attendingUsers?.totalCount ?? 0, event.potentiallyAttendingUsers?.totalCount ?? 0]
            };
        }) ?? [];

        const sortedEvents = rawEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

        // we only want one future event and a max of 10 events;
        // if there is no future event we just want the 10 most recent events
        const firstFutureEvent = sortedEvents.findIndex(e => ArmaEventsService.isInFuture(e.date)) + 1;
        const filteredEvents = sortedEvents.slice(0, firstFutureEvent > 0 ? firstFutureEvent : sortedEvents.length).reverse().slice(0, 10);

        return filteredEvents;
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
}
