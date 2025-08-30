import { Response } from 'express';
import { NormalizedError } from './error.interfaces';

export interface ErrorResponder {
    sendErrorResponse(error: NormalizedError, res: Response): void;
}

export interface ResponderOptions {
    includeStack?: boolean;
    includeDetails?: boolean;
    sanitizeResponse?: boolean;
}
