import { Request, Response } from 'express';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { BadRequestException } from '@lib/error-handling';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { emailService } from '@services/email.service';

export class EmailController {
    /**
     * Resend email verification
     * POST /api/auth/resend-verification
     */
    resendEmailVerification = asyncHandler(
        async (req: Request, res: Response) => {
            const { email } = req.body;

            if (!email) {
                throw new BadRequestException('Email is required');
            }

            // For security, always return success regardless of whether email exists
            // The actual logic is in the service
            await emailService.sendEmailVerification(
                email,
                undefined,
                'dummy-token',
            );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        null,
                        'If the email exists, a verification email has been sent',
                    ),
                );
        },
    );
}

export const emailController = new EmailController();
