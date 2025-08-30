import { z } from 'zod';
import { TicketType } from '@prisma/client';

export const createTicketSchema = z.object({
    eventId: z.string().cuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    type: z.nativeEnum(TicketType),
    price: z.number().nonnegative(),
    currency: z.string().min(1).default('INR').optional(),
    quantity: z.number().int().positive(),
    maxPerUser: z.number().int().positive().max(100).default(10).optional(),
    saleStartDate: z.string().datetime(),
    saleEndDate: z.string().datetime(),
    transferable: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();

export const ticketIdSchema = z.object({ ticketId: z.string().cuid() });

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
