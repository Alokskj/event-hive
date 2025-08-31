import prisma from '../config/prisma';
import {
    CreateEventInput,
    UpdateEventInput,
    ListEventsInput,
} from '../schemas/event.schema';
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
        if (!eventRole)
            throw new ApiError(403, 'Not authorized to update event');
        const event = await prisma.event.update({
            where: { id: eventId },
            data,
        });
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
            page = 0,
            limit = 20,
        } = filters;
        const where: any = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (city) where.city = { contains: city, mode: 'insensitive' };
        if (state) where.state = { contains: state, mode: 'insensitive' };
        if (country) where.country = { contains: country, mode: 'insensitive' };
        if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
        if (typeof isPublic === 'boolean') where.isPublic = isPublic;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        const events = await prisma.event.findMany({
            where,
            include: {
                tickets: true,
            },
            skip: page * limit,
            take: limit,
            orderBy: { startDateTime: 'asc' },
        });

        return {
            data: events,
            meta: {
                total: events.length,
                page,
                limit,
            },
        };
    }

    /**
     * Delete an event
     */
    async deleteEvent(eventId: string, userId: string) {
        // Only ORGANIZER can delete
        const eventRole = await prisma.eventRole.findFirst({
            where: { eventId, userId, role: 'ORGANIZER' },
        });
        if (!eventRole)
            throw new ApiError(403, 'Not authorized to delete event');
        await prisma.event.delete({ where: { id: eventId } });
    }

    /**
     * List events the user hosts (is ORGANIZER or MANAGER)
     */
    async listHostedEvents(userId: string) {
        const roles = await prisma.eventRole.findMany({
            where: { userId, role: { in: ['ORGANIZER', 'MANAGER'] } },
            select: { eventId: true, role: true },
        });
        const eventIds = roles.map((r) => r.eventId);
        if (!eventIds.length) return [];
        const events = await prisma.event.findMany({
            where: { id: { in: eventIds } },
            include: { tickets: true },
            orderBy: { createdAt: 'desc' },
        });
        return events.map((e) => ({
            ...e,
            userRole: roles.find((r) => r.eventId === e.id)?.role,
        }));
    }
}

export const eventService = new EventService();
