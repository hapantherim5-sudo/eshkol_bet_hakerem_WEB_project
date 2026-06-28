import { Router } from 'express';
import { register, unregister } from '../controllers/registrationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/registrations', asyncHandler(register));
router.delete('/registrations', asyncHandler(unregister));

export default router;
