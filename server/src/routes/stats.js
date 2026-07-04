import { Router } from 'express';
import { showStats } from '../controllers/statsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();
router.get('/stats', requireRoles('Admin', 'Staff'), asyncHandler(showStats));

export default router;
