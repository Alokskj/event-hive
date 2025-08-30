import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All audit routes require authentication and admin privileges
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Get audit logs with filtering and pagination
router.get('/logs', auditController.getAuditLogs);

// Get audit logs for a specific user
router.get('/users/:userId/logs', auditController.getUserAuditLogs);

// Get audit logs for a specific entity
router.get(
    '/entities/:entity/:entityId/logs',
    auditController.getEntityAuditLogs,
);

// Get audit statistics
router.get('/stats', auditController.getAuditStats);

// Export audit logs as CSV
router.get('/export', auditController.exportAuditLogs);

// Create manual audit log entry
router.post('/log', auditController.createAuditLog);

// Clean up old audit logs
router.delete('/cleanup', auditController.cleanupOldLogs);

export { router as auditRoutes };
