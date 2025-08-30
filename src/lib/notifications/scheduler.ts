import cron from 'node-cron';
import prisma from '../../config/prisma';
import { notificationOrchestrator } from './orchestrator';

// Runs every 15 minutes to queue reminders
export function startNotificationSchedulers() {
    // 24h reminders
    cron.schedule('*/15 * * * *', async () => {
        const now = new Date();
        const in24hStart = new Date(
            now.getTime() + 24 * 60 * 60 * 1000 - 15 * 60 * 1000,
        );
        const in24hEnd = new Date(
            now.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 1000,
        );
        const events = await prisma.event.findMany({
            where: {
                startDateTime: { gte: in24hStart, lte: in24hEnd },
                status: 'PUBLISHED',
            },
        });
        for (const ev of events) {
            const bookings = await prisma.booking.findMany({
                where: {
                    eventId: ev.id,
                    status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                },
                select: {
                    userId: true,
                    id: true,
                    bookingNumber: true,
                    finalAmount: true,
                    quantity: true,
                },
            });
            for (const b of bookings) {
                await notificationOrchestrator.send(b.userId, 'REMINDER_24H', {
                    event: {
                        title: ev.title,
                        startDateTime: ev.startDateTime,
                        venue: ev.venue,
                    } as any,
                    booking: {
                        bookingNumber: b.bookingNumber,
                        finalAmount: b.finalAmount as any,
                        quantity: b.quantity,
                    },
                });
            }
        }
    });
    // 1h reminders
    cron.schedule('*/10 * * * *', async () => {
        const now = new Date();
        const in1hStart = new Date(
            now.getTime() + 60 * 60 * 1000 - 10 * 60 * 1000,
        );
        const in1hEnd = new Date(
            now.getTime() + 60 * 60 * 1000 + 10 * 60 * 1000,
        );
        const events = await prisma.event.findMany({
            where: {
                startDateTime: { gte: in1hStart, lte: in1hEnd },
                status: 'PUBLISHED',
            },
        });
        for (const ev of events) {
            const bookings = await prisma.booking.findMany({
                where: {
                    eventId: ev.id,
                    status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                },
                select: {
                    userId: true,
                    id: true,
                    bookingNumber: true,
                    finalAmount: true,
                    quantity: true,
                },
            });
            for (const b of bookings) {
                await notificationOrchestrator.send(b.userId, 'REMINDER_1H', {
                    event: {
                        title: ev.title,
                        startDateTime: ev.startDateTime,
                        venue: ev.venue,
                    } as any,
                });
            }
        }
    });
}
