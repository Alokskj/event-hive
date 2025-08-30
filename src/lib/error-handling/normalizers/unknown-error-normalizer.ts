import { NormalizedError } from '../interfaces/error.interfaces';
import { HTTPSTATUS } from '../../../config/http.config';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { BaseErrorNormalizer } from './base/base-error.normalize';

/**
 * Normalizer for unknown error types (fallback normalizer)
 */
export class UnknownErrorNormalizer extends BaseErrorNormalizer {
    canHandle(error: any): boolean {
        // This normalizer can handle any error as a fallback
        return true;
    }

    normalize(error: any, context?: any): NormalizedError {
        let message = 'An unknown error occurred.';
        let details: any = { error: error };

        // Try to extract meaningful information from the error
        if (typeof error === 'string') {
            message = error;
            details = { originalMessage: error };
        } else if (error && typeof error === 'object') {
            if (error.message) {
                message = String(error.message);
            }
            if (error.code) {
                details.code = error.code;
            }
            if (error.name) {
                details.name = error.name;
            }
        }

        return this.createNormalizedError(
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            this.sanitizeMessage(message),
            false,
            ErrorCodeEnum.INTERNAL_SERVER_ERROR,
            details,
            error?.stack,
        );
    }
}
