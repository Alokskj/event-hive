import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.get('/events/:eventId/analytics', analyticsController.getEventAnalytics);
router.get(
    '/events/:eventId/dashboard/summary',
    authenticate,
    analyticsController.getEventDashboardSummary,
);
router.get(
    '/events/:eventId/export',
    authenticate,
    analyticsController.exportEventReport,
);
export { router as analyticsRoutes };
