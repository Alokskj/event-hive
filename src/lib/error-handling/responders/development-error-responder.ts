import { Response } from 'express';
import { NormalizedError, ErrorResponse } from '../interfaces/error.interfaces';
import { BaseErrorResponder } from './base/base-error-responder';

/**
 * Development error responder that provides detailed error information
 * including stack traces and internal details for debugging
 */
export class DevelopmentErrorResponder extends BaseErrorResponder {
    sendErrorResponse(error: NormalizedError, res: Response): void {
        if (this.isHeadersSent(res)) {
            return;
        }

        const response: ErrorResponse = {
            ...this.createErrorResponse(error),
            details: error.details,
            stack: error.stack, // Include stack trace in development
            isOperational: error.isOperational,
        };

        res.status(error.statusCode).json(response);
    }
}
