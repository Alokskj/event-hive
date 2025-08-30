import { z } from 'zod';

// Supported image MIME types
export const SUPPORTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// File upload validation schema
export const fileUploadSchema = z.object({
    shouldOptimize: z.string().optional(),
});

// File deletion schema
export const fileDeleteSchema = z.object({
    fileKey: z
        .string()
        .min(1, 'File key is required')
        .max(1024, 'File key too long'),
});

export type FileUploadRequest = z.infer<typeof fileUploadSchema>;
export type FileDeleteRequest = z.infer<typeof fileDeleteSchema>;
