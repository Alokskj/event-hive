import { Request, Response, NextFunction } from 'express';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
    verifyEmailSchema,
    resendVerificationSchema,
} from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { ApiError } from '../lib/utils/ApiError';
import { asyncHandler } from '../lib/utils/asyncHandler';

export class AuthController {
    /**
     * Register a new user
     */
    register = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = registerSchema.parse(req.body);

        // Register user
        const result = await authService.register(
            validatedData,
            req.ip,
            req.get('User-Agent'),
        );

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Set access token as HTTP-only cookie
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    user: result.user,
                    accessToken: result.accessToken,
                },
                'User registered successfully',
            ),
        );
    });

    /**
     * Login user
     */
    login = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);

        // Login user
        const result = await authService.login(
            validatedData,
            req.ip,
            req.get('User-Agent'),
        );

        // Set refresh token as HTTP-only cookie
        const maxAge = validatedData.rememberMe
            ? 30 * 24 * 60 * 60 * 1000 // 30 days
            : 7 * 24 * 60 * 60 * 1000; // 7 days

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge,
        });

        // Set access token as HTTP-only cookie
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: result.user,
                    accessToken: result.accessToken,
                },
                'Login successful',
            ),
        );
    });

    /**
     * Refresh access token
     */
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token not provided');
        }

        const result = await authService.refreshToken(refreshToken);

        // Set new refresh token as cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    accessToken: result.accessToken,
                },
                'Token refreshed successfully',
            ),
        );
    });

    /**
     * Logout user
     */
    logout = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (userId) {
            await authService.logout(userId);
        }

        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Logout successful'));
    });

    /**
     * Get current user profile
     */
    getProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            throw new ApiError(401, 'User not authenticated');
        }

        const user = await authService.getProfile(userId);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user },
                    'Profile retrieved successfully',
                ),
            );
    });

    /**
     * Update user profile
     */
    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            throw new ApiError(401, 'User not authenticated');
        }

        // Validate request body
        const validatedData = updateProfileSchema.parse(req.body);

        const user = await authService.updateProfile(userId, validatedData);

        return res
            .status(200)
            .json(
                new ApiResponse(200, { user }, 'Profile updated successfully'),
            );
    });

    /**
     * Change password
     */
    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            throw new ApiError(401, 'User not authenticated');
        }

        // Validate request body
        const validatedData = changePasswordSchema.parse(req.body);

        await authService.changePassword(userId, validatedData);

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Password changed successfully'));
    });

    /**
     * Forgot password
     */
    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = forgotPasswordSchema.parse(req.body);

        await authService.forgotPassword(validatedData);

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Password reset email sent'));
    });

    /**
     * Reset password
     */
    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = resetPasswordSchema.parse(req.body);

        await authService.resetPassword(validatedData);

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Password reset successfully'));
    });

    /**
     * Verify email
     */
    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = verifyEmailSchema.parse(req.body);

        await authService.verifyEmail(validatedData);

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Email verified successfully'));
    });

    /**
     * Resend verification email
     */
    resendVerification = asyncHandler(async (req: Request, res: Response) => {
        // Validate request body
        const validatedData = resendVerificationSchema.parse(req.body);

        // Resend email verification
        await authService.resendEmailVerification(validatedData.email);

        return res
            .status(200)
            .json(new ApiResponse(200, null, 'Verification email sent'));
    });
}

export const authController = new AuthController();
