import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import {
    authenticate,
    authorize,
    requireVerified,
    authRateLimit,
} from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post(
    '/forgot-password',
    authRateLimit(3, 15 * 60 * 1000),
    authController.forgotPassword,
);
router.post(
    '/reset-password',
    authRateLimit(3, 15 * 60 * 1000),
    authController.resetPassword,
);
router.post('/verify-email', authController.verifyEmail);
router.post(
    '/resend-verification',
    authRateLimit(3, 15 * 60 * 1000),
    authController.resendVerification,
);

// Protected routes (require authentication)
router.use(authenticate);

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/change-password', authController.changePassword);

// Routes that require verified email
router.use(requireVerified);

// Admin only routes
router.get('/admin/users', authorize(UserRole.ADMIN), (req, res) => {
    res.json({ message: 'Admin users endpoint - to be implemented' });
});

export { router as authRoutes };
