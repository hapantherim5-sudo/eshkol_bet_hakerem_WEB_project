import { Router } from 'express';
import { bootstrap } from '../controllers/bootstrapController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/bootstrap', asyncHandler(bootstrap));

export default router;
