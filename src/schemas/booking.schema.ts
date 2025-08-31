import { z } from 'zod';

export const bookingItemInputSchema = z.object({
    ticketId: z.string().cuid(),
    quantity: z.number().int().positive().max(50),
});

export const createBookingSchema = z.object({
    eventId: z.string().cuid(),
    attendeeName: z.string().min(1),
    attendeeEmail: z.string().email(),
    attendeePhone: z.string().min(5),
    items: z.array(bookingItemInputSchema).min(1),
    notes: z.string().max(500).optional(),
    metadata: z.record(z.any()).optional(),
});

export const bookingIdParamSchema = z.object({ bookingId: z.string().cuid() });

export const bookingListFilterSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingIdParam = z.infer<typeof bookingIdParamSchema>;
export type BookingListFilter = z.infer<typeof bookingListFilterSchema>;
