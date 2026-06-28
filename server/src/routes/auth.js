import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/auth/login', asyncHandler(login));
router.post('/auth/register', asyncHandler(register));

export default router;
