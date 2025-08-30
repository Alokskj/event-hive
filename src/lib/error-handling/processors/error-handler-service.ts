import { Request, Response, NextFunction } from 'express';

// Import necessary interfaces and types
import { NormalizedError, ErrorContext } from '../interfaces/error.interfaces';
import { ErrorNormalizer } from '../interfaces/normalizer.interfaces';
import { ErrorLogger } from '../interfaces/logger.interfaces';

// Import normalizers
import { GenericErrorNormalizer } from '../normalizers/generic-error-normalizer';
import { UnknownErrorNormalizer } from '../normalizers/unknown-error-normalizer';
import { PrismaKnownErrorNormalizer } from '../normalizers/database/prisma-known-error-normalizer';
import { PrismaValidationErrorNormalizer } from '../normalizers/database/prisma-validation-error-normalizer';
import { ZodErrorNormalizer } from '../normalizers/validation/zod-error.normalizer';

// Import responders
import { ErrorResponderFactory } from '../responders/factory/error-responder-factory';

// Import loggers
import { ConsoleErrorLogger } from '../loggers/console-error-logger';
import { FileErrorLogger } from '../loggers/file-error-logger';

import { RequestIdGenerator, UserAgentExtractor } from '../utils';
import { ApiError } from '../errors';

/**
 * Main error handler service that coordinates normalization, logging, and response
 */
export class ErrorHandlerService {
    private normalizers: ErrorNormalizer[] = [];
    private loggers: ErrorLogger[] = [];

    constructor() {
        this.initializeNormalizers();
        this.initializeLoggers();
    }

    private initializeNormalizers(): void {
        // Order matters - more specific normalizers first
        this.normalizers = [
            new ZodErrorNormalizer(),
            new PrismaKnownErrorNormalizer(),
            new PrismaValidationErrorNormalizer(),
            new GenericErrorNormalizer(),
            new UnknownErrorNormalizer(), // Fallback - should be last
        ];
    }

    private initializeLoggers(): void {
        this.loggers = [new ConsoleErrorLogger(), new FileErrorLogger()];
    } /**
     * Main error handling method
     */
    async handleError(
        error: any,
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            // Create error context
            const context = this.createErrorContext(req);

            // Normalize the error
            const normalizedError = this.normalizeError(error, context);

            // Log the error
            await this.logError(normalizedError, req);

            // Send error response
            this.sendErrorResponse(normalizedError, res);
        } catch (handlingError) {
            // If error handling itself fails, send a basic response
            console.error('Error in error handler:', handlingError);
            this.sendFallbackResponse(res);
        }
    }

    /**
     * Process error and return normalized error (without sending response)
     */
    async processError(error: any, req: Request): Promise<NormalizedError> {
        // Create error context
        const context = this.createErrorContext(req);

        // Normalize the error
        const normalizedError = this.normalizeError(error, context);

        // Log the error
        await this.logError(normalizedError, req);

        return normalizedError;
    }
    private createErrorContext(req: Request): ErrorContext {
        return {
            requestId: RequestIdGenerator.generate(),
            userId: req.user?.userId,
            path: req.path,
            method: req.method,
            ip: req.ip,
            userAgent: UserAgentExtractor.extractWithDefault(req, 'Unknown'),
        };
    }

    private normalizeError(error: any, context: ErrorContext): NormalizedError {
        // Handle ApiError instances directly
        if (error instanceof ApiError) {
            return {
                statusCode: error.statusCode,
                message: error.message,
                status: error.status,
                isOperational: error.isOperational,
                errorCode: error.errorCode,
                details: error.details,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                requestId: context.requestId,
            };
        }

        // Find appropriate normalizer
        for (const normalizer of this.normalizers) {
            if (normalizer.canHandle(error)) {
                const normalized = normalizer.normalize(error);
                // Add context information
                normalized.requestId = context.requestId;
                if (!normalized.timestamp) {
                    normalized.timestamp = new Date().toISOString();
                }
                return normalized;
            }
        }

        // This shouldn't happen due to UnknownErrorNormalizer
        throw new Error('No suitable error normalizer found');
    }
    private async logError(
        error: NormalizedError,
        req: Request,
    ): Promise<void> {
        const logPromises = this.loggers.map((logger) =>
            Promise.resolve(logger.logError(error, req)).catch((logErr: any) =>
                console.error('Logger failed:', logErr),
            ),
        );

        await Promise.allSettled(logPromises);
    }

    private sendErrorResponse(error: NormalizedError, res: Response): void {
        const responder = ErrorResponderFactory.getResponder();
        responder.sendErrorResponse(error, res);
    }

    private sendFallbackResponse(res: Response): void {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'An unexpected error occurred',
                timestamp: new Date().toISOString(),
            });
        }
    }

    /**
     * Add custom normalizer
     */
    addNormalizer(normalizer: ErrorNormalizer): void {
        this.normalizers.unshift(normalizer); // Add to beginning for priority
    }

    /**
     * Add custom logger
     */
    addLogger(logger: ErrorLogger): void {
        this.loggers.push(logger);
    }
}
