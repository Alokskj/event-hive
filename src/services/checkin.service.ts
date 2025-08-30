import prisma from '../config/prisma';
import { ApiError } from '../lib/utils/ApiError';

export class CheckInService {
    async checkIn(
        bookingIdOrNumber: { bookingId?: string; bookingNumber?: string },
        userId: string,
        method: string = 'QR',
    ) {
        const booking = await prisma.booking.findFirst({
            where: {
                OR: [
                    bookingIdOrNumber.bookingId
                        ? { id: bookingIdOrNumber.bookingId }
                        : undefined,
                    bookingIdOrNumber.bookingNumber
                        ? { bookingNumber: bookingIdOrNumber.bookingNumber }
                        : undefined,
                ].filter(Boolean) as any,
            },
            include: { event: true, checkIn: true },
        });
        if (!booking) throw new ApiError(404, 'Booking not found');

        const role = await prisma.eventRole.findFirst({
            where: {
                eventId: booking.eventId,
                userId,
                role: { in: ['ORGANIZER', 'MANAGER', 'VOLUNTEER'] },
            },
        });
        if (!role) throw new ApiError(403, 'Not authorized to check in');

        if (booking.status !== 'CONFIRMED' && booking.status !== 'CHECKED_IN')
            throw new ApiError(400, 'Booking not confirmed');

        if (booking.checkIn) {
            throw new ApiError(400, 'Already checked in');
        }
        const checkIn = await prisma.checkIn.create({
            data: {
                eventId: booking.eventId,
                bookingId: booking.id,
                method,
                checkedInBy: userId,
            },
        });
        await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CHECKED_IN' },
        });
        return {
            checkIn,
            booking: { ...booking, checkIn },
            alreadyCheckedIn: false,
        };
    }

    async listEventCheckIns(eventId: string, userId: string) {
        // authorize
        const role = await prisma.eventRole.findFirst({
            where: {
                eventId,
                userId,
                role: { in: ['ORGANIZER', 'MANAGER', 'VOLUNTEER'] },
            },
        });
        if (!role) throw new ApiError(403, 'Not authorized');
        const checkIns = await prisma.checkIn.findMany({
            where: { eventId },
            include: {
                booking: {
                    select: {
                        id: true,
                        bookingNumber: true,
                        attendeeName: true,
                        attendeeEmail: true,
                        attendeePhone: true,
                        quantity: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { checkedInAt: 'desc' },
            take: 500,
        });
        return checkIns.map((c) => ({
            id: c.id,
            checkedInAt: c.checkedInAt,
            method: c.method,
            booking: c.booking,
        }));
    }
}
export const checkInService = new CheckInService();
