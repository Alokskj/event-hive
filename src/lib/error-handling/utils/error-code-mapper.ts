import {
    ErrorCodeEnum,
    ErrorCodeEnumType,
} from '../../../enums/error-code.enum';

export class ErrorCodeMapper {
    private static readonly EXTERNAL_MAPPINGS = new Map<
        ErrorCodeEnumType,
        string
    >([
        [ErrorCodeEnum.VALIDATION_ERROR, 'VALIDATION_FAILED'],
        [ErrorCodeEnum.UNAUTHORIZED, 'AUTH_REQUIRED'],
        [ErrorCodeEnum.FORBIDDEN, 'ACCESS_DENIED'],
        [ErrorCodeEnum.RESOURCE_NOT_FOUND, 'NOT_FOUND'],
        [ErrorCodeEnum.RESOURCE_ALREADY_EXISTS, 'ALREADY_EXISTS'],
        [ErrorCodeEnum.DATABASE_ERROR, 'DATA_ERROR'],
        [ErrorCodeEnum.EXTERNAL_SERVICE_ERROR, 'SERVICE_ERROR'],
        [ErrorCodeEnum.INTERNAL_SERVER_ERROR, 'SYSTEM_ERROR'],
    ]);

    static toExternal(internalCode?: ErrorCodeEnumType): string | undefined {
        if (!internalCode) return undefined;
        return this.EXTERNAL_MAPPINGS.get(internalCode) || internalCode;
    }

    static fromHttpStatus(statusCode: number): ErrorCodeEnumType {
        switch (statusCode) {
            case 400:
                return ErrorCodeEnum.VALIDATION_ERROR;
            case 401:
                return ErrorCodeEnum.UNAUTHORIZED;
            case 403:
                return ErrorCodeEnum.FORBIDDEN;
            case 404:
                return ErrorCodeEnum.RESOURCE_NOT_FOUND;
            case 409:
                return ErrorCodeEnum.RESOURCE_ALREADY_EXISTS;
            case 422:
                return ErrorCodeEnum.VALIDATION_ERROR;
            case 429:
                return ErrorCodeEnum.RATE_LIMIT_EXCEEDED;
            case 502:
                return ErrorCodeEnum.EXTERNAL_SERVICE_ERROR;
            case 503:
                return ErrorCodeEnum.SERVICE_UNAVAILABLE;
            case 504:
                return ErrorCodeEnum.TIMEOUT_ERROR;
            default:
                return ErrorCodeEnum.INTERNAL_SERVER_ERROR;
        }
    }
}
