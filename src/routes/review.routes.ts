import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.get('/events/:eventId/reviews', reviewController.listForEvent);
router.post('/reviews', authenticate, reviewController.create);
router.put('/reviews/:reviewId', authenticate, reviewController.update);
router.delete('/reviews/:reviewId', authenticate, reviewController.delete);
export { router as reviewRoutes };
