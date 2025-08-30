import prisma from '../config/prisma';
import { ApiError } from '../lib/utils/ApiError';

export class AnalyticsService {
    /**
     * Aggregate analytics for an event: tickets sold, revenue, active attendees, breakdowns
     */
    async getEventAnalytics(eventId: string) {
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw new ApiError(404, 'Event not found');

        // Fetch confirmed bookings (including CHECKED_IN)
        const bookings = await prisma.booking.findMany({
            where: { eventId, status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
            select: {
                id: true,
                userId: true,
                finalAmount: true,
                attendeePhone: true,
                items: {
                    select: {
                        quantity: true,
                        unitPrice: true,
                        ticket: { select: { type: true, name: true } },
                    },
                },
            },
        });

        let ticketsSold = 0;
        let revenue = 0;
        const ticketMap: Record<
            string,
            { type: string; name: string; quantity: number; revenue: number }
        > = {};
        const userSet = new Set<string>();
        const countryMap: Record<string, number> = {};

        function extractCountryCode(phone?: string | null): string | null {
            if (!phone) return null;
            const match = phone.match(/^\+(\d{1,3})/);
            return match ? '+' + match[1] : null;
        }

        bookings.forEach((b) => {
            userSet.add(b.userId);
            revenue += Number(b.finalAmount);
            const cc = extractCountryCode(b.attendeePhone);
            if (cc) countryMap[cc] = (countryMap[cc] || 0) + 1;
            b.items.forEach((it) => {
                ticketsSold += it.quantity;
                const key = it.ticket.type + '|' + it.ticket.name;
                if (!ticketMap[key])
                    ticketMap[key] = {
                        type: it.ticket.type,
                        name: it.ticket.name,
                        quantity: 0,
                        revenue: 0,
                    };
                ticketMap[key].quantity += it.quantity;
                ticketMap[key].revenue += Number(it.unitPrice) * it.quantity;
            });
        });

        const ticketBreakdown = Object.values(ticketMap).sort(
            (a, b) => b.quantity - a.quantity,
        );
        const countryBreakdown = Object.entries(countryMap)
            .map(([countryCode, attendees]) => ({ countryCode, attendees }))
            .sort((a, b) => b.attendees - a.attendees);

        const capacity = event.maxAttendees || null;
        const soldPercentage = capacity
            ? +((ticketsSold / capacity) * 100).toFixed(2)
            : null;

        return {
            eventId,
            summary: {
                ticketsSold,
                revenue,
                activeAttendees: userSet.size,
                bookings: bookings.length,
                capacity,
                soldPercentage,
            },
            ticketBreakdown,
            countryBreakdown,
            generatedAt: new Date().toISOString(),
        };
    }

    /**
     * Lightweight dashboard summary (bookings, revenue, checkIns, ticketsSold) with role auth
     */
    async getEventDashboardSummary(eventId: string, userId: string) {
        // authorize
        const role = await prisma.eventRole.findFirst({
            where: { eventId, userId, role: { in: ['ORGANIZER', 'MANAGER'] } },
        });
        if (!role) throw new ApiError(403, 'Not authorized');
        const [agg, checkInsCount, event] = await Promise.all([
            prisma.booking.aggregate({
                where: { eventId, status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
                _sum: { finalAmount: true, quantity: true },
                _count: { _all: true },
            }),
            prisma.checkIn.count({ where: { eventId } }),
            prisma.event.findUnique({
                where: { id: eventId },
                select: { maxAttendees: true },
            }),
        ]);
        const ticketsSold = agg._sum.quantity || 0;
        const capacity = event?.maxAttendees || null;
        const revenue = Number(agg._sum.finalAmount || 0);
        const bookings = agg._count._all;
        const soldPercentage = capacity
            ? +((ticketsSold / capacity) * 100).toFixed(2)
            : null;
        // today activity
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayBookings = await prisma.booking.count({
            where: {
                eventId,
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                createdAt: { gte: startOfDay },
            },
        });
        const todayCheckIns = await prisma.checkIn.count({
            where: { eventId, checkedInAt: { gte: startOfDay } },
        });
        return {
            eventId,
            summary: {
                bookings,
                ticketsSold,
                checkIns: checkInsCount,
                revenue,
                capacity,
                soldPercentage,
            },
            today: { bookings: todayBookings, checkIns: todayCheckIns },
            generatedAt: new Date().toISOString(),
        };
    }
}
export const analyticsService = new AnalyticsService();
