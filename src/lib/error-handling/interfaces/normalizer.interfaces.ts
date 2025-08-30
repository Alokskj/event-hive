import { NormalizedError } from './error.interfaces';

export interface ErrorNormalizer {
    canHandle(error: any): boolean;
    normalize(error: any): NormalizedError;
}

export interface ErrorNormalizationOptions {
    includeStack?: boolean;
    sanitizeDetails?: boolean;
    maxMessageLength?: number;
}
