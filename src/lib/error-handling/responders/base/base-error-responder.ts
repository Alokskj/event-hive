import { Response } from 'express';
import { ErrorResponder } from '../../interfaces/responder.interfaces';
import {
    ErrorResponse,
    NormalizedError,
} from '../../interfaces/error.interfaces';

export abstract class BaseErrorResponder implements ErrorResponder {
    abstract sendErrorResponse(error: NormalizedError, res: Response): void;

    protected createErrorResponse(error: NormalizedError): ErrorResponse {
        return {
            success: false,
            status: error.status,
            message: error.message,
            errorCode: error.errorCode,
            timestamp: error.timestamp || new Date().toISOString(),
            requestId: error.requestId,
        };
    }

    protected isHeadersSent(res: Response): boolean {
        return res.headersSent;
    }
}
