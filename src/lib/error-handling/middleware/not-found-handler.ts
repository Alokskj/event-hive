import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors';
import { HTTPSTATUS } from '../../../config/http.config';

/**
 * 404 Not Found handler
 */
export const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const error = new ApiError(
        HTTPSTATUS.NOT_FOUND,
        `Not found - ${req.originalUrl}`,
    );
    next(error);
};
