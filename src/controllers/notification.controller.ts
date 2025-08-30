import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { notificationService } from '../services/notification.service';

export class NotificationController {
    listMine = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const notifications =
            await notificationService.listUserNotifications(userId);
        res.json(
            new ApiResponse(200, { notifications }, 'Notifications fetched'),
        );
    });
}
export const notificationController = new NotificationController();
