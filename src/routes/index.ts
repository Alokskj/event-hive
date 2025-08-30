import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { auditRoutes } from './audit.routes';
import { eventRoutes } from './event.routes';
import { ticketRoutes } from './ticket.routes';
import { bookingRoutes } from './booking.routes';
import { paymentRoutes } from './payment.routes';
import { reviewRoutes } from './review.routes';
import { checkInRoutes } from './checkin.routes';
import { analyticsRoutes } from './analytics.routes';
import { notificationRoutes } from './notification.routes';
import emailRoutes from './email.routes';
import fileRoutes from './file-upload.route';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Audit routes
router.use('/audit', auditRoutes);

// Event routes
router.use('/events', eventRoutes);
router.use('/', paymentRoutes);
router.use('/', ticketRoutes);
router.use('/', bookingRoutes);
router.use('/', reviewRoutes);
router.use('/', checkInRoutes);
router.use('/', analyticsRoutes);
router.use('/', notificationRoutes);

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
