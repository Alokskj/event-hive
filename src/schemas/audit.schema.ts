import { z } from 'zod';

// Validation schemas
export const getAuditLogsSchema = z.object({
    userId: z.string().optional(),
    entity: z.string().optional(),
    action: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('50'),
});

export const getUserAuditLogsSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('50'),
});

export const getEntityAuditLogsSchema = z.object({
    entity: z.string().min(1, 'Entity is required'),
    entityId: z.string().min(1, 'Entity ID is required'),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('50'),
});

export const cleanupLogsSchema = z.object({
    daysToKeep: z.number().min(1).max(3650).optional().default(365),
});
