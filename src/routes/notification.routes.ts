import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.get('/notifications/me', authenticate, notificationController.listMine);
export { router as notificationRoutes };
