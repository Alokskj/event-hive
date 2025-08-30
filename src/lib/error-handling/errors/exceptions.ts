import { HTTPSTATUS, HttpStatusCodeType } from '../../../config/http.config';
import {
    ErrorCodeEnum,
    ErrorCodeEnumType,
} from '../../../enums/error-code.enum';
import { ApiError } from './base/api-error';

export class HttpException extends ApiError {
    constructor(
        message = 'Http Exception Error',
        statusCode: HttpStatusCodeType,
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(statusCode, message, true, errorCode, details);
    }
}

export class InternalServerException extends HttpException {
    constructor(
        message = 'Internal Server Error',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR,
            details,
        );
    }
}

export class NotFoundException extends HttpException {
    constructor(
        message = 'Resource not found',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND,
            details,
        );
    }
}

export class BadRequestException extends HttpException {
    constructor(
        message = 'Bad Request',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR,
            details,
        );
    }
}

export class UnauthorizedException extends HttpException {
    constructor(
        message = 'Unauthorized Access',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED,
            details,
        );
    }
}

export class ForbiddenException extends HttpException {
    constructor(
        message = 'Forbidden',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.FORBIDDEN,
            errorCode || ErrorCodeEnum.ACCESS_FORBIDDEN,
            details,
        );
    }
}

export class ConflictException extends HttpException {
    constructor(
        message = 'Conflict',
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(
            message,
            HTTPSTATUS.CONFLICT,
            errorCode || ErrorCodeEnum.RESOURCE_CONFLICT,
            details,
        );
    }
}
