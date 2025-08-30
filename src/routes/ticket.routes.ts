import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/events/:eventId/tickets', ticketController.listByEvent);
router.post('/events/:eventId/tickets', authenticate, ticketController.create);
router.put('/tickets/:ticketId', authenticate, ticketController.update);
router.delete('/tickets/:ticketId', authenticate, ticketController.delete);

export { router as ticketRoutes };
