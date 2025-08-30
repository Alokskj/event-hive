import { Response } from 'express';
import { NormalizedError } from '../interfaces';

/**
 * Development Error Handler
 * Provides detailed error information including stack traces for debugging
 */
export class DevErrorHandler {
    /**
     * Handle error in development environment
     * @param error - Normalized error object
     * @param res - Express response object
     */
    handle(error: NormalizedError, res: Response): void {
        const errorResponse = {
            success: false,
            status: error.status,
            message: error.message,
            errorCode: error.errorCode,
            details: error.details,
            stack: error.stack,
            isOperational: error.isOperational,
            timestamp: new Date().toISOString(),
            requestId: error.requestId,
        };

        res.status(error.statusCode).json(errorResponse);
    }
}

/**
 * Singleton instance for development error handler
 */
export const devErrorHandler = new DevErrorHandler();
