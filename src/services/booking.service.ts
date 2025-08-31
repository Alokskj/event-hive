import prisma from '../config/prisma';
import { CreateBookingInput } from '../schemas/booking.schema';
import { ApiError } from '../lib/utils/ApiError';
import crypto from 'crypto';

function generateBookingNumber() {
    return (
        'BK-' +
        Date.now().toString(36) +
        '-' +
        crypto.randomBytes(3).toString('hex')
    );
}

export class BookingService {
    async createBooking(data: CreateBookingInput, userId: string) {
        const event = await prisma.event.findUnique({
            where: { id: data.eventId },
        });
        if (!event) throw new ApiError(404, 'Event not found');
        if (event.status !== 'PUBLISHED')
            throw new ApiError(400, 'Event not published');
        return prisma.$transaction(async (tx) => {
            const ticketIds = data.items.map((i) => i.ticketId);
            const tickets = await tx.ticket.findMany({
                where: {
                    id: { in: ticketIds },
                    eventId: data.eventId,
                    isActive: true,
                },
            });
            if (tickets.length !== ticketIds.length)
                throw new ApiError(400, 'Some tickets invalid');
            let total = 0;
            const now = new Date();
            for (const item of data.items) {
                const ticket = tickets.find((t) => t.id === item.ticketId)!;
                if (item.quantity > ticket.maxPerUser)
                    throw new ApiError(
                        400,
                        `Quantity exceeds per-user limit for ${ticket.name}`,
                    );
                if (ticket.soldQuantity + item.quantity > ticket.quantity)
                    throw new ApiError(
                        400,
                        `Not enough availability for ${ticket.name}`,
                    );

                total += Number(ticket.price) * item.quantity;
            }
            const bookingNumber = generateBookingNumber();
            const finalAmount = total;
            const booking = await tx.booking.create({
                data: {
                    bookingNumber,
                    eventId: data.eventId,
                    userId,
                    attendeeName: data.attendeeName,
                    attendeeEmail: data.attendeeEmail,
                    attendeePhone: data.attendeePhone,
                    totalAmount: total.toString(),
                    discountAmount: '0',
                    finalAmount: finalAmount.toString(),
                    currency: 'INR',
                    quantity: data.items.reduce((s, i) => s + i.quantity, 0),
                    status: 'PENDING',
                    metadata: data.metadata as any,
                    notes: data.notes,
                    items: {
                        create: data.items.map((i) => {
                            const ticket = tickets.find(
                                (t) => t.id === i.ticketId,
                            )!;
                            const unitPrice = Number(ticket.price);
                            return {
                                ticketId: i.ticketId,
                                quantity: i.quantity,
                                unitPrice: unitPrice.toString(),
                                totalPrice: (unitPrice * i.quantity).toString(),
                            };
                        }),
                    },
                },
                include: { items: true },
            });
            for (const item of data.items) {
                await tx.ticket.update({
                    where: { id: item.ticketId },
                    data: { soldQuantity: { increment: item.quantity } },
                });
            }
            return booking;
        });
    }

    async getBooking(bookingId: string, userId: string) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { items: true, event: true, payment: true },
        });
        if (!booking) throw new ApiError(404, 'Booking not found');
        if (booking.userId !== userId) throw new ApiError(403, 'Forbidden');
        return booking;
    }
    async listUserBookings(
        userId: string,
        opts: { page?: number; limit?: number; search?: string },
    ) {
        const { page = 0, limit = 10, search } = opts;
        const where: any = { userId };
        if (search) {
            where.OR = [
                { bookingNumber: { contains: search, mode: 'insensitive' } },
                { attendeeName: { contains: search, mode: 'insensitive' } },
                { attendeeEmail: { contains: search, mode: 'insensitive' } },
                { event: { title: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            startDateTime: true,
                            endDateTime: true,
                            city: true,
                            state: true,
                            bannerImage: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);
        return { items, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async cancelBooking(bookingId: string, userId: string) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { items: true },
        });
        if (!booking) throw new ApiError(404, 'Booking not found');
        if (booking.userId !== userId) throw new ApiError(403, 'Forbidden');
        if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED')
            throw new ApiError(400, 'Cannot cancel this booking');
        return prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED', cancelledAt: new Date() },
            });
            for (const item of booking.items) {
                await tx.ticket.update({
                    where: { id: item.ticketId },
                    data: { soldQuantity: { decrement: item.quantity } },
                });
            }
        });
    }
}
export const bookingService = new BookingService();
