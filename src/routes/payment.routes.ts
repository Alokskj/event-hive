import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.post('/payments/initiate', paymentController.initiate);
router.post('/payments/verify', paymentController.verify);
export { router as paymentRoutes };
