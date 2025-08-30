import { z } from 'zod';

export const checkInSchema = z
    .object({
        bookingId: z.string().cuid().optional(),
        bookingNumber: z.string().optional(),
        method: z.enum(['QR', 'BARCODE', 'MANUAL']).optional(),
    })
    .refine((d) => d.bookingId || d.bookingNumber, {
        message: 'bookingId or bookingNumber required',
    });
