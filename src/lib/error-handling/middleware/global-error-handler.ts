import { Request, Response, NextFunction } from 'express';
import { ErrorHandlerService } from '../processors';

// Global error handler service instance
const errorHandlerService = new ErrorHandlerService();

/**
 * Global error handling middleware
 */
export const globalErrorHandlerMiddleware = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    await errorHandlerService.handleError(err, req, res, next);
};
