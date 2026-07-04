import { Router } from 'express';
import { createEvent, deleteEvent, replaceOpportunityEvents } from '../controllers/eventController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireRoles } from '../middleware/auth.js';

const router = Router();

router.post('/events', requireRoles('Admin', 'Staff'), asyncHandler(createEvent));
router.delete('/events/:id', requireRoles('Admin', 'Staff'), asyncHandler(deleteEvent));
router.put('/events/by-opportunity/:opportunityId', requireRoles('Admin', 'Staff'), asyncHandler(replaceOpportunityEvents));

export default router;
