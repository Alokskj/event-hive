import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import {
    createBookingSchema,
    bookingIdParamSchema,
    bookingListFilterSchema,
} from '../schemas/booking.schema';
import { bookingService } from '../services/booking.service';

export class BookingController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const data = createBookingSchema.parse({
            ...req.body,
            eventId: req.params.eventId,
        });
        const booking = await bookingService.createBooking(data, userId);
        res.status(201).json(new ApiResponse(201, booking, 'Booking created'));
    });
    get = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { bookingId } = bookingIdParamSchema.parse(req.params);
        const booking = await bookingService.getBooking(bookingId, userId);
        res.json(new ApiResponse(200, booking, 'Booking fetched'));
    });
    listMine = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const filters = bookingListFilterSchema.parse(req.query);
        const bookings = await bookingService.listUserBookings(userId, filters);
        res.json(new ApiResponse(200, bookings, 'Bookings fetched'));
    });
    cancel = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { bookingId } = bookingIdParamSchema.parse(req.params);
        await bookingService.cancelBooking(bookingId, userId);
        res.json(new ApiResponse(200, null, 'Booking cancelled'));
    });
}
export const bookingController = new BookingController();
