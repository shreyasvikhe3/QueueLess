import { Router } from 'express';
import { MLController } from '../controllers/mlController.js';

const router = Router();

router.post('/predict', MLController.predict);
router.get('/history', MLController.getHistoryDataset);

export default router;
