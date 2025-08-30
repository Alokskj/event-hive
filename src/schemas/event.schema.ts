import { z } from 'zod';
import { EventCategory, EventStatus } from '@prisma/client';

export const createEventSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    shortDescription: z.string().max(200).optional(),
    category: z.nativeEnum(EventCategory),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(EventStatus).optional(),
    startDateTime: z.string().datetime(),
    endDateTime: z.string().datetime(),
    timezone: z.string().max(50).optional(),
    venue: z.string().min(2),
    address: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isOnline: z.boolean().optional(),
    onlineLink: z.string().url().optional().nullable(),
    bannerImage: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
    maxAttendees: z.number().int().positive().optional(),
    isPublic: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    allowWaitlist: z.boolean().optional(),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(5),
});

export const updateEventSchema = createEventSchema.partial();

export const eventIdSchema = z.object({
    eventId: z.string().cuid(),
});

export const listEventsSchema = z.object({
    category: z.nativeEnum(EventCategory).optional(),
    status: z.nativeEnum(EventStatus).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    isFeatured: z.coerce.boolean().optional(),
    isPublic: z.coerce.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsInput = z.infer<typeof listEventsSchema>;
