import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { checkInSchema } from '../schemas/checkin.schema';
import { ApiError } from '../lib/utils/ApiError';
import { checkInService } from '../services/checkin.service';

export class CheckInController {
    checkIn = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        const data = checkInSchema.parse(req.body);
        console.log(data);
        const { checkIn, booking, alreadyCheckedIn } =
            await checkInService.checkIn(
                {
                    bookingId: data.bookingId,
                    bookingNumber: data.bookingNumber,
                },
                userId!,
                data.method,
            );
        res.json(
            new ApiResponse(
                200,
                { checkIn, booking, alreadyCheckedIn },
                alreadyCheckedIn ? 'Already checked in' : 'Checked in',
            ),
        );
    });
    listEventCheckIns = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { eventId } = req.params;
        const data = await checkInService.listEventCheckIns(eventId, userId);
        res.json(new ApiResponse(200, data, 'Event check-ins'));
    });
}
export const checkInController = new CheckInController();
