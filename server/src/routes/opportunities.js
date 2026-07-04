import { Router } from 'express';
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();

router.post('/opportunities', requireRoles('Admin', 'Staff'), asyncHandler(createOpportunity));
router.put('/opportunities/:id', requireRoles('Admin', 'Staff'), asyncHandler(updateOpportunity));
router.delete('/opportunities/:id', requireRoles('Admin', 'Staff'), asyncHandler(deleteOpportunity));

export default router;
