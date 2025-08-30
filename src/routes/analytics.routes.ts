import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();
router.post('/events/:eventId/view', analyticsController.recordView);
router.get('/events/:eventId/analytics', analyticsController.getEventAnalytics);
export { router as analyticsRoutes };
