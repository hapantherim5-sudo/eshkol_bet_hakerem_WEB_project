// File: server/src/routes/events.js
// Purpose: events script
// Role: API route handler for events

import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';
import { nextId } from '../middleware/counter.js';

const router = Router();

router.post('/events', async (req, res, next) => {
  try {
    const id = await nextId('events');
    const item = { ...req.body, id };
    await getDb().collection(COLLECTIONS.events).insertOne(item);
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.delete('/events/:id', async (req, res, next) => {
  try {
    await getDb().collection(COLLECTIONS.events).deleteOne({ id: Number(req.params.id) });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.put('/events/by-opportunity/:opportunityId', async (req, res, next) => {
  try {
    const opportunityId = Number(req.params.opportunityId);
    const eventDefs = req.body?.eventDefs || [];
    const db = getDb();
    await db.collection(COLLECTIONS.events).deleteMany({ opportunityId });
    const added = [];
    for (const def of eventDefs) {
      const id = await nextId('events');
      const item = { ...def, id, opportunityId };
      await db.collection(COLLECTIONS.events).insertOne(item);
      added.push(item);
    }
    res.json(added);
  } catch (err) { next(err); }
});

export default router;
