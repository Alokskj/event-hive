import { Request, Response } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { ApiError } from '../lib/utils/ApiError';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { initiatePaymentSchema } from '../schemas/payment.schema';
import { paymentService } from '../services/payment.service';

export class PaymentController {
    initiate = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) throw new ApiError(401, 'Unauthorized');
        const { bookingId, method } = initiatePaymentSchema.parse(req.body);
        const payment = await paymentService.initiate(
            bookingId,
            method,
            userId,
        );
        res.status(201).json(new ApiResponse(201, payment, 'Payment success'));
    });

    verify = asyncHandler(async (req: Request, res: Response) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body || {};
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
            throw new ApiError(400, 'Missing payment verification params');
        const result = await paymentService.verifyAndCapture({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });
        res.json(new ApiResponse(200, result, 'Payment verified'));
    });
}
export const paymentController = new PaymentController();
