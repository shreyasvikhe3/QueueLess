import { Router } from 'express';
import { TokenController } from '../controllers/tokenController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', TokenController.createToken);
router.get('/active', TokenController.getActiveToken);
router.get('/history', TokenController.getTokenHistory);
router.get('/:id', TokenController.getTokenById);
router.put('/:id/cancel', TokenController.cancelToken);
router.post('/:id/checkin', TokenController.checkInToken);

export default router;
