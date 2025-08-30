import { ApiError } from './base/api-error';
import { ErrorCodeEnum } from '../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../config/http.config';

export class DatabaseError extends ApiError {
    constructor(message: string, operation: string, originalError?: any) {
        super(
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            `Database error during ${operation}: ${message}`,
            false,
            ErrorCodeEnum.DATABASE_ERROR,
            { operation, originalError: originalError?.message },
        );
        this.name = 'DatabaseError';
    }
}
