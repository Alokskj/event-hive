import { ApiError } from './base/api-error';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../config/http.config';

export class ExternalServiceError extends ApiError {
    constructor(service: string, message: string, originalError?: any) {
        super(
            HTTPSTATUS.BAD_GATEWAY,
            `External service error: ${service} - ${message}`,
            true,
            ErrorCodeEnum.EXTERNAL_SERVICE_ERROR,
            { service, originalError: originalError?.message },
        );
        this.name = 'ExternalServiceError';
    }
}
