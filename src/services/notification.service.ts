import prisma from '../config/prisma';

export class NotificationService {
    async listUserNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
}
export const notificationService = new NotificationService();
