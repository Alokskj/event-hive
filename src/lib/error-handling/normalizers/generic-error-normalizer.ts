import { NormalizedError } from '../interfaces/error.interfaces';
import { HTTPSTATUS } from '../../../config/http.config';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { BaseErrorNormalizer } from './base/base-error.normalize';

/**
 * Normalizer for generic JavaScript Error instances
 */
export class GenericErrorNormalizer extends BaseErrorNormalizer {
    canHandle(error: any): boolean {
        return error instanceof Error && !(error as any).statusCode;
    }

    normalize(error: Error, context?: any): NormalizedError {
        return this.createNormalizedError(
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            'An unexpected error occurred.',
            false,
            ErrorCodeEnum.INTERNAL_SERVER_ERROR,
            {
                originalMessage: error.message,
                name: error.name,
            },
            error.stack,
        );
    }
}
