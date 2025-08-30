import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { auditRoutes } from './audit.routes';
import emailRoutes from './email.routes';
import fileRoutes from './file-upload.route';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Audit routes
router.use('/audit', auditRoutes);

// Email routes
router.use('/email', emailRoutes);

// file upload route
router.use('/file-upload', fileRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Event Hive API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
