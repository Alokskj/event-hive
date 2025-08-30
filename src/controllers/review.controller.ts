import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import {
    createReviewSchema,
    reviewIdParamSchema,
} from '../schemas/review.schema';
import { reviewService } from '../services/review.service';

export class ReviewController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { eventId, rating, comment, isPublic } = createReviewSchema.parse(
            req.body,
        );
        const review = await reviewService.createReview(
            eventId,
            userId,
            rating,
            comment,
            isPublic,
        );
        res.status(201).json(
            new ApiResponse(201, { review }, 'Review created'),
        );
    });
    listForEvent = asyncHandler(async (req: Request, res: Response) => {
        const eventId = req.params.eventId;
        const reviews = await reviewService.listEventReviews(eventId);
        res.json(new ApiResponse(200, { reviews }, 'Reviews fetched'));
    });
    update = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { reviewId } = reviewIdParamSchema.parse(req.params);
        const review = await reviewService.updateReview(
            reviewId,
            userId,
            req.body,
        );
        res.json(new ApiResponse(200, { review }, 'Review updated'));
    });
    delete = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { reviewId } = reviewIdParamSchema.parse(req.params);
        await reviewService.deleteReview(reviewId, userId);
        res.json(new ApiResponse(200, null, 'Review deleted'));
    });
}
export const reviewController = new ReviewController();
