import { Router } from 'express';
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/opportunities', asyncHandler(createOpportunity));
router.put('/opportunities/:id', asyncHandler(updateOpportunity));
router.delete('/opportunities/:id', asyncHandler(deleteOpportunity));

export default router;
