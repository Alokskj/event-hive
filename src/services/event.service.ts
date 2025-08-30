import prisma from '../config/prisma';
import { EventStatus, EventCategory } from '@prisma/client';
import { CreateEventInput, UpdateEventInput, ListEventsInput } from '../schemas/event.schema';
import { ApiError } from '../lib/utils/ApiError';

export class EventService {
    /**
     * Create a new event
     */
    async createEvent(data: CreateEventInput, userId: string) {
        // Organizer is assigned as ORGANIZER in EventRole
        const event = await prisma.event.create({
            data: {
                ...data,
                eventRoles: {
                    create: [{ userId, role: 'ORGANIZER' }],
                },
            },
            include: { eventRoles: true },
        });
        return event;
    }

    /**
     * Update an event
     */
    async updateEvent(eventId: string, data: UpdateEventInput, userId: string) {
        // Only ORGANIZER or MANAGER can update
        const eventRole = await prisma.eventRole.findFirst({
            where: { eventId, userId, role: { in: ['ORGANIZER', 'MANAGER'] } },
        });
        if (!eventRole) throw new ApiError(403, 'Not authorized to update event');
        const event = await prisma.event.update({ where: { id: eventId }, data });
        return event;
    }

    /**
     * Get event by ID
     */
    async getEventById(eventId: string) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { tickets: true, eventRoles: true },
        });
        if (!event) throw new ApiError(404, 'Event not found');
        return event;
    }

    /**
     * List events with filters
     */
    async listEvents(filters: ListEventsInput) {
        const {
            category,
            status,
            city,
            state,
            country,
            isFeatured,
            isPublic,
            search,
            skip = 0,
            take = 20,
        } = filters;
        const where: any = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (city) where.city = city;
        if (state) where.state = state;
        if (country) where.country = country;
        if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
        if (typeof isPublic === 'boolean') where.isPublic = isPublic;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        const events = await prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: { startDateTime: 'asc' },
        });
        return events;
    }

    /**
     * Delete an event
     */
    async deleteEvent(eventId: string, userId: string) {
        // Only ORGANIZER can delete
        const eventRole = await prisma.eventRole.findFirst({
            where: { eventId, userId, role: 'ORGANIZER' },
        });
        if (!eventRole) throw new ApiError(403, 'Not authorized to delete event');
        await prisma.event.delete({ where: { id: eventId } });
    }
}

export const eventService = new EventService();
