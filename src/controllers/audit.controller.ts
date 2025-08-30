import { Request, Response } from 'express';
import { z } from 'zod';
import { auditService } from '../services/audit.service';
import { ApiResponse } from '../lib/utils/ApiResponse';
import { ApiError } from '../lib/utils/ApiError';
import { asyncHandler } from '../lib/utils/asyncHandler';
import {
    getAuditLogsSchema,
    cleanupLogsSchema,
    getEntityAuditLogsSchema,
    getUserAuditLogsSchema,
} from '@schemas/audit.schema';

export class AuditController {
    /**
     * Get audit logs with filtering
     * GET /api/audit/logs
     */
    getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const validatedQuery = getAuditLogsSchema.parse(req.query);

        const { page, limit, ...filters } = validatedQuery;
        const offset = (page - 1) * limit;

        // Convert date strings to Date objects
        const options = {
            ...filters,
            startDate: filters.startDate
                ? new Date(filters.startDate)
                : undefined,
            endDate: filters.endDate ? new Date(filters.endDate) : undefined,
            limit,
            offset,
        };

        const result = await auditService.getAuditLogs(options);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    logs: result.logs,
                    pagination: {
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit),
                        hasNext: result.hasMore,
                        hasPrev: page > 1,
                    },
                },
                'Audit logs retrieved successfully',
            ),
        );
    });

    /**
     * Get audit logs for a specific user
     * GET /api/audit/users/:userId/logs
     */
    getUserAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const validatedQuery = getUserAuditLogsSchema.parse({
            ...req.query,
            userId,
        });

        const { page, limit } = validatedQuery;
        const offset = (page - 1) * limit;

        const logs = await auditService.getUserAuditLogs(userId, limit, offset);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    logs,
                    pagination: {
                        page,
                        limit,
                        hasNext: logs.length === limit,
                        hasPrev: page > 1,
                    },
                },
                'User audit logs retrieved successfully',
            ),
        );
    });

    /**
     * Get audit logs for a specific entity
     * GET /api/audit/entities/:entity/:entityId/logs
     */
    getEntityAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const { entity, entityId } = req.params;
        const validatedQuery = getEntityAuditLogsSchema.parse({
            ...req.query,
            entity,
            entityId,
        });

        const { page, limit } = validatedQuery;
        const offset = (page - 1) * limit;

        const logs = await auditService.getEntityAuditLogs(
            entity,
            entityId,
            limit,
            offset,
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    logs,
                    pagination: {
                        page,
                        limit,
                        hasNext: logs.length === limit,
                        hasPrev: page > 1,
                    },
                },
                'Entity audit logs retrieved successfully',
            ),
        );
    });

    /**
     * Get audit statistics
     * GET /api/audit/stats
     */
    getAuditStats = asyncHandler(async (req: Request, res: Response) => {
        const days = req.query.days ? parseInt(req.query.days as string) : 30;

        if (isNaN(days) || days < 1 || days > 365) {
            throw new ApiError(400, 'Days must be a number between 1 and 365');
        }

        const stats = await auditService.getAuditStats(days);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    stats,
                    period: `${days} days`,
                    generatedAt: new Date().toISOString(),
                },
                'Audit statistics retrieved successfully',
            ),
        );
    });

    /**
     * Clean up old audit logs (admin only)
     * DELETE /api/audit/cleanup
     */
    cleanupOldLogs = asyncHandler(async (req: Request, res: Response) => {
        const validatedBody = cleanupLogsSchema.parse(req.body);
        const { daysToKeep } = validatedBody;

        const deletedCount = await auditService.cleanupOldLogs(daysToKeep);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    deletedCount,
                    daysToKeep,
                    cleanupDate: new Date().toISOString(),
                },
                `Cleaned up ${deletedCount} old audit log entries`,
            ),
        );
    });

    /**
     * Create a manual audit log entry (admin only)
     * POST /api/audit/log
     */
    createAuditLog = asyncHandler(async (req: Request, res: Response) => {
        const logSchema = z.object({
            userId: z.string().optional(),
            action: z.string().min(1, 'Action is required'),
            entity: z.string().min(1, 'Entity is required'),
            entityId: z.string().optional(),
            metadata: z.record(z.any()).optional(),
        });

        const validatedData = logSchema.parse(req.body);
        const adminUserId = req.user?.userId;

        await auditService.log({
            ...validatedData,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        });

        // Log that an admin created a manual audit entry
        if (adminUserId) {
            await auditService.logAdmin(
                adminUserId,
                'MANUAL_AUDIT_LOG_CREATED',
                'AuditLog',
                '',
                null,
                validatedData,
                req.ip,
                req.get('User-Agent'),
            );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    null,
                    'Audit log entry created successfully',
                ),
            );
    });
}

export const auditController = new AuditController();
