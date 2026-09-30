import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/analytics', AdminController.getAnalytics);
router.get('/organizations', AdminController.getOrganizations);
router.get('/departments', AdminController.getDepartments);
router.get('/services', AdminController.getServices);
router.get('/counters', AdminController.getCounters);
router.get('/users', AdminController.getUsers);
router.post('/counters/assign-staff', AdminController.assignStaffToCounter);

export default router;
