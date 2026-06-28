import { Router } from 'express';
import { createEvent, deleteEvent, replaceOpportunityEvents } from '../controllers/eventController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/events', asyncHandler(createEvent));
router.delete('/events/:id', asyncHandler(deleteEvent));
router.put('/events/by-opportunity/:opportunityId', asyncHandler(replaceOpportunityEvents));

export default router;
