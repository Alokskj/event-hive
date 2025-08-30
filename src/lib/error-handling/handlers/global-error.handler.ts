import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';
import { HTTPSTATUS } from '../../../config/http.config';
import _config from '../../../config/_config';
import { ErrorHandlerService } from '../processors';
import { devErrorHandler } from './dev-error.handler';
import { prodErrorHandler } from './prod-error.handler';

type ControllerFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

/**
 * Global Error Handler
 * Orchestrates error handling across different environments
 */
export class GlobalErrorHandler {
    private errorHandlerService: ErrorHandlerService;

    constructor() {
        this.errorHandlerService = new ErrorHandlerService();
    }

    /**
     * Handle errors globally with environment-specific responses
     * @param err - Error object
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async handle(
        err: any,
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            // Use the error handler service to process the error
            const normalizedError = await this.errorHandlerService.processError(
                err,
                req,
            );

            // Choose handler based on environment
            if (_config.env === 'development') {
                devErrorHandler.handle(normalizedError, res);
            } else {
                prodErrorHandler.handle(normalizedError, res);
            }
        } catch (handlerError) {
            // Fallback error handling if our error handler fails
            console.error('Error in error handler:', handlerError);

            res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                status: 'error',
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    }
}
