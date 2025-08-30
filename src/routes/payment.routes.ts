import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.post('/payments/verify', paymentController.verify);
router.post('/payments/initiate', authenticate, paymentController.initiate);
export { router as paymentRoutes };
