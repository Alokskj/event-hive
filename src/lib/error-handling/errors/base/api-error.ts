import { ErrorCodeEnumType } from '../../../../enums/error-code.enum';

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;
    public readonly errorCode?: ErrorCodeEnumType;
    public readonly details?: any;

    constructor(
        statusCode: number,
        message: string,
        isOperational: boolean = true,
        errorCode?: ErrorCodeEnumType,
        details?: any,
        stack?: string,
    ) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = isOperational;
        this.errorCode = errorCode;
        this.details = details;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
