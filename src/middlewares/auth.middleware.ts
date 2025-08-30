import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../lib/utils/ApiError';
import { TokenPayload, verifyToken } from '../lib/utils/jwt';
import { UserRole } from '@prisma/client';
import prisma from '../config/prisma';

export type AuthUser = TokenPayload & {
    userId: string;
    email: string;
    role?: UserRole;
};

/**
 * Middleware to authenticate user using JWT token
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies.accessToken;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : cookieToken;

        if (!token) {
            throw new ApiError(401, 'Access token not provided');
        }

        // Verify token
        const payload = verifyToken(token, 'access');

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        if (!user.isVerified) {
            throw new ApiError(403, 'Email verification required');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'Account is deactivated');
        }

        // Add user to request object
        req.user = payload as AuthUser;

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
        console.error('Authentication error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            data: null,
        });
    }
};

/**
 * Middleware to check if user has specific roles
 */
export const authorize = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new ApiError(401, 'User not authenticated');
            }

            // Get user's current role from database
            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
                select: { role: true },
            });

            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            if (!roles.includes(user.role)) {
                throw new ApiError(403, 'Insufficient permissions');
            }

            next();
        } catch (error) {
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    data: null,
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Authorization check failed',
                data: null,
            });
        }
    };
};

/**
 * Middleware to check if user is verified
 */
export const requireVerified = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'User not authenticated');
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { isVerified: true },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (!user.isVerified) {
            throw new ApiError(403, 'Email verification required');
        }

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: null,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Verification check failed',
            data: null,
        });
    }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
export const authRateLimit = (
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000,
) => {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
        const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();

        // Clean up expired entries
        for (const [ip, data] of attempts.entries()) {
            if (now > data.resetTime) {
                attempts.delete(ip);
            }
        }

        const clientAttempts = attempts.get(clientIp);

        if (!clientAttempts) {
            attempts.set(clientIp, { count: 1, resetTime: now + windowMs });
            return next();
        }

        if (now > clientAttempts.resetTime) {
            attempts.set(clientIp, { count: 1, resetTime: now + windowMs });
            return next();
        }

        if (clientAttempts.count >= maxAttempts) {
            const remainingTime = Math.ceil(
                (clientAttempts.resetTime - now) / 1000 / 60,
            );
            return res.status(429).json({
                success: false,
                message: `Too many authentication attempts. Please try again in ${remainingTime} minutes.`,
                data: null,
            });
        }

        clientAttempts.count++;
        next();
    };
};
