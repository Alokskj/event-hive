import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { checkInSchema } from '../schemas/checkin.schema';
import { checkInService } from '../services/checkin.service';
import prisma from '@config/prisma';

export class CheckInController {
    checkIn = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const data = checkInSchema.parse(req.body);
        const result = await checkInService.checkIn(
            { bookingId: data.bookingId, bookingNumber: data.bookingNumber },
            userId,
            data.method,
        );
        await prisma.booking.update({
            where: { id: result.bookingId },
            data: { status: 'CHECKED_IN' },
        });
        res.json(new ApiResponse(200, { checkIn: result }, 'Checked in'));
    });
}
export const checkInController = new CheckInController();
