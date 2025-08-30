import prisma from '../config/prisma';
import { ApiError } from '../lib/utils/ApiError';

export class ReviewService {
    async createReview(
        eventId: string,
        userId: string,
        rating: number,
        comment?: string,
        isPublic: boolean = true,
    ) {
        const confirmed = await prisma.booking.findFirst({
            where: {
                eventId,
                userId,
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
            },
        });
        if (!confirmed)
            throw new ApiError(400, 'You must attend the event to review it');
        return prisma.review.create({
            data: { eventId, userId, rating, comment, isPublic },
        });
    }
    async listEventReviews(eventId: string) {
        return prisma.review.findMany({
            where: { eventId, isPublic: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateReview(
        reviewId: string,
        userId: string,
        data: { rating?: number; comment?: string; isPublic?: boolean },
    ) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) throw new ApiError(404, 'Review not found');
        if (review.userId !== userId) throw new ApiError(403, 'Forbidden');
        return prisma.review.update({ where: { id: reviewId }, data });
    }
    async deleteReview(reviewId: string, userId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) throw new ApiError(404, 'Review not found');
        if (review.userId !== userId) throw new ApiError(403, 'Forbidden');
        await prisma.review.delete({ where: { id: reviewId } });
    }
}
export const reviewService = new ReviewService();
