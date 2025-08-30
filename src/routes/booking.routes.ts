import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.post('/events/:eventId/bookings', bookingController.create);
router.get('/bookings/:bookingId', bookingController.get);
router.get('/me/bookings', bookingController.listMine);
router.post('/bookings/:bookingId/cancel', bookingController.cancel);
export { router as bookingRoutes };
