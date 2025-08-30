import { ErrorCodeEnumType } from '../../../../enums/error-code.enum';
import { NormalizedError } from '../../interfaces/error.interfaces';
import { ErrorNormalizer } from '../../interfaces/normalizer.interfaces';

export abstract class BaseErrorNormalizer implements ErrorNormalizer {
    abstract canHandle(error: any): boolean;
    abstract normalize(error: any): NormalizedError;

    protected createNormalizedError(
        statusCode: number,
        message: string,
        isOperational: boolean,
        errorCode?: ErrorCodeEnumType,
        details?: any,
        stack?: string,
    ): NormalizedError {
        return {
            statusCode,
            message,
            status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
            isOperational,
            errorCode,
            details,
            stack,
            timestamp: new Date().toISOString(),
        };
    }

    protected sanitizeMessage(
        message: string,
        maxLength: number = 200,
    ): string {
        if (!message) return 'An error occurred';
        return message.length > maxLength
            ? message.substring(0, maxLength) + '...'
            : message;
    }

    protected extractErrorDetails(error: any): any {
        const details: any = {};

        if (error.code) details.code = error.code;
        if (error.name) details.name = error.name;
        if (error.meta) details.meta = error.meta;

        return Object.keys(details).length > 0 ? details : undefined;
    }
}
