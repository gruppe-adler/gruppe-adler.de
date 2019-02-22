import { BlogPost } from './BlogPost';
import { ForumUser } from './ForumUser';

export const EVENT_REPORT_TYPE = 'EventReport';

export class EventReport extends BlogPost {
    public type: string = EVENT_REPORT_TYPE;
    public participants: number;
    public externalParticipants: number;

    constructor({ id, heading, content, pinnedImage, tags, author, date, participants, externalParticipants,
         published }: {
        id: string,
        heading: string,
        content: string,
        pinnedImage: string,
        tags: string[],
        author: ForumUser,
        date: Date,
        participants: number,
        externalParticipants: number,
        published: boolean
    }) {
        super({ id, heading, content, pinnedImage, tags, author, date, published });
        this.participants = participants;
        this.externalParticipants = externalParticipants;
    }
}
