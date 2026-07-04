import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();

router.use('/users', requireRoles('Admin'));
router.get('/users', asyncHandler(listUsers));
router.post('/users', asyncHandler(createUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
