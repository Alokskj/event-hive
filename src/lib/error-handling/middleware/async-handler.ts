import { NextFunction, Request, Response } from 'express';

type ControllerFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: ControllerFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
