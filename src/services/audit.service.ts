import prisma from '../config/prisma';

export interface AuditLogData {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

export class AuditService {
    /**
     * Create a new audit log entry
     */
    async log(data: AuditLogData): Promise<void> {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    oldValues: data.oldValues
                        ? this.sanitizeData(data.oldValues)
                        : undefined,
                    newValues: data.newValues
                        ? this.sanitizeData(data.newValues)
                        : undefined,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        } catch (error) {
            // Log error but don't fail the main operation
            console.error('Failed to create audit log:', error);
        }
    }

    /**
     * Log user authentication events
     */
    async logAuth(
        userId: string,
        action:
            | 'USER_REGISTERED'
            | 'USER_LOGIN'
            | 'USER_LOGOUT'
            | 'PASSWORD_CHANGED'
            | 'PASSWORD_RESET_REQUESTED'
            | 'PASSWORD_RESET'
            | 'EMAIL_VERIFIED'
            | 'PROFILE_UPDATED',
        metadata?: Record<string, any>,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        await this.log({
            userId,
            action,
            entity: 'User',
            entityId: userId,
            metadata,
            ipAddress,
            userAgent,
        });
    }

    /**
     * Log user profile updates
     */
    async logProfileUpdate(
        userId: string,
        oldValues: any,
        newValues: any,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        await this.log({
            userId,
            action: 'PROFILE_UPDATED',
            entity: 'User',
            entityId: userId,
            oldValues,
            newValues,
            ipAddress,
            userAgent,
        });
    }

    /**
     * Log security events
     */
    async logSecurity(
        action:
            | 'FAILED_LOGIN'
            | 'ACCOUNT_LOCKED'
            | 'ACCOUNT_BANNED'
            | 'ACCOUNT_UNBANNED'
            | 'SUSPICIOUS_ACTIVITY',
        entityId?: string,
        userId?: string,
        metadata?: Record<string, any>,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        await this.log({
            userId,
            action,
            entity: 'Security',
            entityId,
            metadata,
            ipAddress,
            userAgent,
        });
    }

    /**
     * Log administrative actions
     */
    async logAdmin(
        adminUserId: string,
        action: string,
        targetEntity: string,
        targetEntityId: string,
        oldValues?: any,
        newValues?: any,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<void> {
        await this.log({
            userId: adminUserId,
            action,
            entity: targetEntity,
            entityId: targetEntityId,
            oldValues,
            newValues,
            ipAddress,
            userAgent,
        });
    }

    /**
     * Get audit logs for a specific user
     */
    async getUserAuditLogs(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ) {
        return await prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }

    /**
     * Get audit logs for a specific entity
     */
    async getEntityAuditLogs(
        entity: string,
        entityId: string,
        limit: number = 50,
        offset: number = 0,
    ) {
        return await prisma.auditLog.findMany({
            where: {
                entity,
                entityId,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
        });
    }

    /**
     * Get audit logs with filtering and pagination
     */
    async getAuditLogs(options: {
        userId?: string;
        entity?: string;
        action?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }) {
        const {
            userId,
            entity,
            action,
            startDate,
            endDate,
            limit = 50,
            offset = 0,
        } = options;

        const whereClause: any = {};

        if (userId) whereClause.userId = userId;
        if (entity) whereClause.entity = entity;
        if (action) whereClause.action = action;

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = startDate;
            if (endDate) whereClause.createdAt.lte = endDate;
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.auditLog.count({ where: whereClause }),
        ]);

        return {
            logs,
            total,
            hasMore: total > offset + limit,
        };
    }

    /**
     * Get audit statistics
     */
    async getAuditStats(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const stats = await prisma.auditLog.groupBy({
            by: ['action'],
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            _count: {
                action: true,
            },
        });

        return stats.map((stat) => ({
            action: stat.action,
            count: stat._count.action,
        }));
    }

    /**
     * Clean up old audit logs (for maintenance)
     */
    async cleanupOldLogs(daysToKeep: number = 365): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const result = await prisma.auditLog.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate,
                },
            },
        });

        return result.count;
    }

    /**
     * Sanitize data for logging (remove sensitive information)
     */
    private sanitizeData(data: any): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        const sanitized = JSON.parse(JSON.stringify(data));

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];

        const removeSensitiveFields = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(removeSensitiveFields);
            }

            if (obj && typeof obj === 'object') {
                const result = { ...obj };

                for (const key in result) {
                    if (
                        sensitiveFields.some((field) =>
                            key.toLowerCase().includes(field.toLowerCase()),
                        )
                    ) {
                        result[key] = '[REDACTED]';
                    } else if (typeof result[key] === 'object') {
                        result[key] = removeSensitiveFields(result[key]);
                    }
                }

                return result;
            }

            return obj;
        };

        return removeSensitiveFields(sanitized);
    }
}

export const auditService = new AuditService();
