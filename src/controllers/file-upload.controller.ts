import { Request, Response } from 'express';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTPSTATUS } from '@config/http.config';
import { asyncHandler } from '@lib/error-handling';
import { fileDeleteSchema, fileUploadSchema } from '@schemas/file-upload';
import { fileUploadService } from '@services/file-upload.service';

export class FileUploadController {
    uploadFile = asyncHandler(async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(HTTPSTATUS.BAD_REQUEST).json(
                new ApiResponse(
                    HTTPSTATUS.BAD_REQUEST,
                    null,
                    'No file provided',
                ),
            );
            return;
        }
        const body = fileUploadSchema.parse(req.body);

        const { buffer, originalname, mimetype } = req.file;
        const result = await fileUploadService.uploadFile(
            buffer,
            originalname,
            mimetype,
            body.shouldOptimize === 'true',
        );
        res.status(HTTPSTATUS.CREATED).json(
            new ApiResponse(
                HTTPSTATUS.CREATED,
                result,
                'File uploaded successfully',
            ),
        );
    });

    deleteFile = asyncHandler(async (req: Request, res: Response) => {
        const validatedData = fileDeleteSchema.parse(req.body);
        const result = await fileUploadService.deleteFile(validatedData);

        if (!result.success) {
            res.status(HTTPSTATUS.NOT_FOUND).json(
                new ApiResponse(HTTPSTATUS.NOT_FOUND, null, result.message),
            );
            return;
        }

        res.status(HTTPSTATUS.OK).json(
            new ApiResponse(HTTPSTATUS.OK, null, result.message),
        );
    });
}

export const fileUploadController = new FileUploadController();
