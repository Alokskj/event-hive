import {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@lib/error-handling';
import sharp from 'sharp';
import _config from '@config/_config';
import { s3Client } from '@config/s3.config';
import { FileDeleteRequest, SUPPORTED_IMAGE_TYPES } from '@schemas/file-upload';

export interface UploadResponse {
    success: boolean;
    fileKey: string;
    fileUrl: string;
    message: string;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}

export interface FileExistsResponse {
    exists: boolean;
    fileKey?: string;
    fileUrl?: string;
}

export class FileUploadService {
    async uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        contentType: string,
        shouldOptimize: boolean,
    ): Promise<UploadResponse> {
        if (!this.isValidContentType(contentType)) {
            throw new BadRequestException('Unsupported content type');
        }

        const fileKey = this.generateFileKey(fileName);

        let file = sharp(fileBuffer);

        if (shouldOptimize) {
            // Optimize the image using sharp
            file = file
                .resize({ width: 800, fit: 'inside' })
                .webp({ quality: 80 }); // optional: resize to max width
        } else {
            file = file.webp();
        }

        const command = new PutObjectCommand({
            Bucket: _config.s3Bucket,
            Key: fileKey,
            Body: await file.toBuffer(),
            ContentType: 'image/webp',
            Metadata: {
                'original-name': fileName,
                'upload-time': Date.now().toString(),
            },
        });

        await s3Client.send(command);

        const fileUrl = this.getFileUrl(fileKey);

        return {
            success: true,
            fileKey,
            fileUrl,
            message: 'File uploaded successfully',
        };
    }

    /**
     * Delete a file from R2
     */
    async deleteFile(request: FileDeleteRequest): Promise<DeleteResponse> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: _config.s3Bucket,
                Key: request.fileKey,
            });

            await s3Client.send(command);

            return {
                success: true,
                message: 'File deleted successfully',
            };
        } catch (error) {
            throw new Error(
                `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    /**
     * Generate a unique file key with timestamp and UUID
     */
    private generateFileKey(_originalFileName: string): string {
        const timestamp = Date.now();
        const uuid = uuidv4();
        const extension = 'webp';
        return `uploads/${timestamp}-${uuid}.${extension}`;
    }

    private getFileUrl(fileKey: string): string {
        return `${_config.s3Endpoint}/${fileKey}`;
    }

    /**
     * Validate if content type is supported
     */
    private isValidContentType(contentType: string): boolean {
        return SUPPORTED_IMAGE_TYPES.includes(contentType as any);
    }
}

export const fileUploadService = new FileUploadService();
