import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const initiatePaymentSchema = z.object({
    bookingId: z.string().cuid(),
    method: z.nativeEnum(PaymentMethod),
});

export const refundPaymentSchema = z.object({
    paymentId: z.string().cuid(),
    reason: z.string().min(3).optional(),
});
