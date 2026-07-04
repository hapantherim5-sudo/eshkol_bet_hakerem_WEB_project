import { Router } from 'express';
import { register, unregister } from '../controllers/registrationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();

router.post('/registrations', requireRoles('User'), asyncHandler(register));
router.delete('/registrations', requireRoles('User'), asyncHandler(unregister));

export default router;
