import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
    recordView = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = req.params;
        await analyticsService.recordView(eventId);
        res.json(new ApiResponse(200, null, 'View recorded'));
    });

    getEventAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const { eventId } = req.params;
        const data = await analyticsService.getEventAnalytics(eventId);
        res.json(new ApiResponse(200, data, 'Event analytics'));
    });
}
export const analyticsController = new AnalyticsController();
