import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', eventController.listEvents);
router.get('/:eventId', eventController.getEventById);

// Protected routes
router.use(authenticate);
router.post('/', eventController.createEvent);
router.put('/:eventId', eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);

export { router as eventRoutes };
