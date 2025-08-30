import { ZodError } from 'zod';
import { ErrorCodeEnum } from '../../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../../config/http.config';
import { BaseErrorNormalizer } from '../base/base-error.normalize';
import { NormalizedError } from '../../interfaces/error.interfaces';

export class ZodErrorNormalizer extends BaseErrorNormalizer {
    canHandle(error: any): boolean {
        return error instanceof ZodError;
    }

    normalize(error: ZodError): NormalizedError {
        const errorDetails = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
        }));

        const primaryError = error.issues[0];
        const message =
            error.issues.length === 1
                ? `Validation failed for field '${primaryError.path.join('.')}': ${primaryError.message}`
                : `Validation failed for ${error.issues.length} fields`;

        return this.createNormalizedError(
            HTTPSTATUS.BAD_REQUEST,
            message,
            true,
            ErrorCodeEnum.VALIDATION_ERROR,
            {
                validationErrors: errorDetails,
                errorCount: error.issues.length,
                firstError: {
                    field: primaryError.path.join('.'),
                    message: primaryError.message,
                },
            },
            error.stack,
        );
    }
}
