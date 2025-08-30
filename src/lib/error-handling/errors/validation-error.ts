import { ApiError } from './base/api-error';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../config/http.config';

export class ValidationError extends ApiError {
    constructor(message: string, validationDetails?: any) {
        super(
            HTTPSTATUS.BAD_REQUEST,
            message,
            true,
            ErrorCodeEnum.VALIDATION_ERROR,
            validationDetails,
        );
        this.name = 'ValidationError';
    }
}
