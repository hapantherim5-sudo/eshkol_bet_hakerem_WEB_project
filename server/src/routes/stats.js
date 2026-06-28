import { Router } from 'express';
import { showStats } from '../controllers/statsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/stats', asyncHandler(showStats));

export default router;
