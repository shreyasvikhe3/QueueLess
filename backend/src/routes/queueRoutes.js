import { Router } from 'express';
import { QueueController } from '../controllers/queueController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Public / User read endpoint for queue status
router.get('/service/:serviceId', QueueController.getQueueByService);

// Staff & Admin queue management routes
router.use(authenticateToken);
router.use(requireRole('STAFF', 'ADMIN'));

router.post('/next', QueueController.callNext);
router.post('/token/:tokenId/complete', QueueController.completeToken);
router.post('/token/:tokenId/skip', QueueController.skipToken);
router.post('/token/:tokenId/recall', QueueController.recallToken);

export default router;
