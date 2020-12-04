import { Router } from 'express';
import { globalErrorHandler, wrapAsync } from '../../utils/express';
import { ArmaEventsService } from '../../utils/EventsService';

const armaEventService = ArmaEventsService.getInstance();

const eventsRouter = Router();

eventsRouter.get('/', wrapAsync(async (req, res) => {
    const { events, lastModified } = await armaEventService.getEvents();

    res.header('Cache-Control', 'no-cache');
    res.header('Last-Modified', lastModified.toUTCString());

    res.json(events);
}));

eventsRouter.use(globalErrorHandler);

export default eventsRouter;
