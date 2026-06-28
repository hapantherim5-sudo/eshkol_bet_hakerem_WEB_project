import { Router } from 'express';
import { createView } from '../controllers/viewController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.post('/views', asyncHandler(createView));

export default router;
