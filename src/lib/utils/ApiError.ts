import { HttpStatusCodeType } from '../../config/http.config';
import { ErrorCodeEnumType } from '../../enums/error-code.enum';

// AppError class Constructor
export class ApiError extends Error {
    statusCode: HttpStatusCodeType;
    errorCode?: ErrorCodeEnumType;
    status: string;
    isOperational: boolean;
    details?: any;

    constructor(
        statusCode: HttpStatusCodeType,
        message: string,
        errorCode?: ErrorCodeEnumType,
        details?: any,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
