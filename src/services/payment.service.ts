import prisma from '../config/prisma';
import { ApiError } from '../lib/utils/ApiError';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { razorpay } from '../config/payment.config';
import crypto from 'crypto';
import { emailService } from './email.service';

export class PaymentService {
    async initiate(bookingId: string, method: PaymentMethod, userId: string) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        });
        if (!booking) throw new ApiError(404, 'Booking not found');
        if (booking.userId !== userId) throw new ApiError(403, 'Forbidden');
        if (booking.payment)
            throw new ApiError(400, 'Payment already initiated');

        // Create Razorpay order (amount in paise)
        const amountNumber = Number(booking.finalAmount) * 100; // convert to smallest unit
        const order = await razorpay.orders.create({
            amount: Math.round(amountNumber),
            currency: booking.currency,
            receipt: booking.bookingNumber,
            notes: { bookingId },
        });

        // Store payment with PENDING status and gatewayOrderId
        const payment = await prisma.payment.create({
            data: {
                bookingId,
                amount: booking.finalAmount,
                currency: booking.currency,
                method,
                status: 'PENDING',
                gatewayOrderId: order.id,
            },
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            paymentId: payment.id,
            bookingNumber: booking.bookingNumber,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
        };
    }

    async verifyAndCapture(
        params: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        },
        userId: string,
    ) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            params;
        // find payment by order id
        const payment = await prisma.payment.findFirst({
            where: { gatewayOrderId: razorpay_order_id },
            include: { booking: true },
        });
        if (!payment) throw new ApiError(404, 'Payment record not found');
        if (payment.booking.userId !== userId)
            throw new ApiError(403, 'Forbidden');
        if (payment.status !== 'PENDING')
            throw new ApiError(400, 'Payment already processed');

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generatedSignature !== razorpay_signature)
            throw new ApiError(400, 'Invalid payment signature');

        // Mark success
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'SUCCESS',
                gatewayPaymentId: razorpay_payment_id,
                paidAt: new Date(),
            },
        });
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CONFIRMED', confirmedAt: new Date() },
        });
        // Send ticket & confirmation (fire and forget)
        emailService
            .sendTicketEmail(payment.bookingId)
            .catch((e) => console.error('Ticket email error', e));
        return { status: 'SUCCESS' as PaymentStatus };
    }
}
export const paymentService = new PaymentService();
