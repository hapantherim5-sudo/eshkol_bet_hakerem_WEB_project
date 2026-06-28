import { Router } from 'express';
import { showProfile } from '../controllers/profileController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/profiles/:userId', asyncHandler(showProfile));

export default router;
