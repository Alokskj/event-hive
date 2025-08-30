import { Router } from 'express';
import { emailController } from '../controllers/email.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.post('/resend-verification', emailController.resendEmailVerification);

// Protected routes (authentication required)
router.use(authenticate);

export default router;
