import { z } from 'zod';

export const createReviewSchema = z.object({
    eventId: z.string().cuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(2000).optional(),
    isPublic: z.boolean().optional(),
});

export const reviewIdParamSchema = z.object({ reviewId: z.string().cuid() });
