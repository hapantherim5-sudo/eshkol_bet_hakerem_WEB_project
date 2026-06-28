import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/users', asyncHandler(listUsers));
router.post('/users', asyncHandler(createUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
