import { Router } from 'express';
import { showProfile } from '../controllers/profileController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireSelfOrRoles } from '../middleware/auth.js';

const router = Router();
router.get('/profiles/:userId', requireSelfOrRoles('userId', 'Admin'), asyncHandler(showProfile));

export default router;
