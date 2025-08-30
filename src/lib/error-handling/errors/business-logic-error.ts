import { ApiError } from './base/api-error';
import {
    ErrorCodeEnum,
    ErrorCodeEnumType,
} from '../../../enums/error-code.enum';
import { HTTPSTATUS } from '../../../config/http.config';

export class BusinessLogicError extends ApiError {
    constructor(message: string, errorCode?: ErrorCodeEnumType, details?: any) {
        super(
            HTTPSTATUS.BAD_REQUEST,
            message,
            true,
            errorCode || ErrorCodeEnum.BUSINESS_RULE_VIOLATION,
            details,
        );
        this.name = 'BusinessLogicError';
    }
}
