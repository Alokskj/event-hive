import { Response } from 'express';
import { HTTPSTATUS } from '../../../config/http.config';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { NormalizedError } from '../interfaces';

/**
 * Production Error Handler
 * Sanitizes error responses and hides sensitive information in production
 */
export class ProdErrorHandler {
    /**
     * Handle error in production environment
     * @param error - Normalized error object
     * @param res - Express response object
     */
    handle(error: NormalizedError, res: Response): void {
        if (error.isOperational) {
            // Operational errors are safe to expose
            const errorResponse = {
                success: false,
                status: error.status,
                message: error.message,
                errorCode: error.errorCode,
                // Only include safe details in production
                details: this.sanitizeDetails(error.details),
                timestamp: new Date().toISOString(),
                requestId: error.requestId,
            };

            res.status(error.statusCode).json(errorResponse);
        } else {
            // Programming errors - hide details and send generic error
            const genericErrorResponse = {
                success: false,
                status: 'error',
                message: 'Something went wrong! Please try again later.',
                errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
                requestId: error.requestId,
            };

            res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json(
                genericErrorResponse,
            );
        }
    }

    /**
     * Sanitize error details for production use
     * @param details - Raw error details
     * @returns Sanitized details safe for production
     */
    private sanitizeDetails(details: any): any {
        if (!details) return undefined;

        // Remove sensitive information
        const sanitized = { ...details };

        // Remove database connection strings, stack traces, file paths, etc.
        const sensitiveKeys = [
            'password',
            'token',
            'secret',
            'connectionString',
            'stack',
            'filePath',
            'originalMessage',
        ];

        sensitiveKeys.forEach((key) => {
            if (sanitized[key]) {
                delete sanitized[key];
            }
        });

        // Recursively sanitize nested objects
        Object.keys(sanitized).forEach((key) => {
            if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                sanitized[key] = this.sanitizeDetails(sanitized[key]);
            }
        });

        return Object.keys(sanitized).length > 0 ? sanitized : undefined;
    }
}

/**
 * Singleton instance for production error handler
 */
export const prodErrorHandler = new ProdErrorHandler();
