import { Router } from 'express';
import { list } from '../controllers/organizationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/organizations', asyncHandler(list));

export default router;
