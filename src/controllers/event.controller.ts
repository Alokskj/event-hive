import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { ApiError } from '../lib/utils/ApiError';
import { asyncHandler } from '../lib/utils/asyncHandler';
import {
    createEventSchema,
    updateEventSchema,
    eventIdSchema,
    listEventsSchema,
} from '../schemas/event.schema';

export class EventController {
    /**
     * Create a new event
     */
    createEvent = asyncHandler(async (req: Request, res: Response) => {
        const validatedData = createEventSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'User not authenticated');
        const event = await eventService.createEvent(validatedData, userId);
        return res
            .status(201)
            .json(new ApiResponse(201, event, 'Event created successfully'));
    });

    /**
     * Update an event
     */
    updateEvent = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = eventIdSchema.parse(req.params);
        const validatedData = updateEventSchema.parse(req.body);
        const userId = req.user?.userId;

        const event = await eventService.updateEvent(
            eventId,
            validatedData,
            userId!,
        );
        return res
            .status(200)
            .json(new ApiResponse(200, event, 'Event updated successfully'));
    });

    /**
     * Get event by ID
     */
    getEventById = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = eventIdSchema.parse(req.params);
        const event = await eventService.getEventById(eventId);
        return res
            .status(200)
            .json(new ApiResponse(200, event, 'Event retrieved successfully'));
    });

    /**
     * List events with filters
     */
    listEvents = asyncHandler(async (req: Request, res: Response) => {
        const filters = listEventsSchema.parse(req.query);
        const data = await eventService.listEvents(filters);
        return res
            .status(200)
            .json(new ApiResponse(200, data, 'Events retrieved successfully'));
    });

    /**
     * Delete an event
     */
    deleteEvent = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = eventIdSchema.parse(req.params);
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'User not authenticated');
        await eventService.deleteEvent(eventId, userId);
        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Event deleted successfully'));
    });
}

export const eventController = new EventController();
