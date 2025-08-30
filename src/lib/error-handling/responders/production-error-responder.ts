import { Response } from 'express';
import { NormalizedError } from '../interfaces/error.interfaces';
import { BaseErrorResponder } from './base/base-error-responder';
import { HTTPSTATUS } from '../../../config/http.config';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { ErrorSanitizer } from '../utils';

/**
 * Production error responder that provides minimal error information
 * and hides sensitive details from client responses
 */
export class ProductionErrorResponder extends BaseErrorResponder {
    sendErrorResponse(error: NormalizedError, res: Response): void {
        if (this.isHeadersSent(res)) {
            return;
        }

        if (error.isOperational) {
            // For operational errors, send safe error details
            const response = {
                ...this.createErrorResponse(error),
                details: ErrorSanitizer.sanitizeObject(error.details),
            };

            res.status(error.statusCode).json(response);
        } else {
            // Send generic error response
            const response = {
                success: false,
                status: 'error',
                message: 'Something went wrong! Please try again later.',
                errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
                requestId: error.requestId,
            };

            res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json(response);
        }
    }
}
