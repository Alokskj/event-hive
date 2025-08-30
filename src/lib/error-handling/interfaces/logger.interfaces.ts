import { Request } from 'express';
import { NormalizedError } from './error.interfaces';

export interface ErrorLogger {
    logError(error: NormalizedError, req: Request): void;
}

export interface LogData {
    timestamp: string;
    level: string;
    requestId: string;
    path: string;
    method: string;
    ip?: string;
    userAgent?: string;
    statusCode: number;
    message: string;
    errorCode?: string;
    isOperational: boolean;
    details?: any;
    stack?: string;
}
