import { Router } from 'express';
import { checkInController } from '../controllers/checkin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.post('/check-in', authenticate, checkInController.checkIn);
router.get(
    '/events/:eventId/check-ins',
    authenticate,
    checkInController.listEventCheckIns,
);
export { router as checkInRoutes };
