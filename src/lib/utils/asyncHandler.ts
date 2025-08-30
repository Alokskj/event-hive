import { NextFunction, Request, Response } from 'express';

type ControllerFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

export const asyncHandler =
    (controller: ControllerFunction) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };
