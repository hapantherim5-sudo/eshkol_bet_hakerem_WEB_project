// File: server/src/routes/opportunities.js
// Purpose: opportunities script
// Role: API route handler for opportunities

import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';
import { nextId } from '../middleware/counter.js';

const router = Router();

router.post('/opportunities', async (req, res, next) => {
  try {
    const id = await nextId('opportunities');
    const item = { ...req.body, id };
    await getDb().collection(COLLECTIONS.opportunities).insertOne(item);
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put('/opportunities/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const opp = { ...req.body, id };
    await getDb().collection(COLLECTIONS.opportunities).replaceOne({ id }, opp, { upsert: true });
    res.json(opp);
  } catch (err) { next(err); }
});

router.delete('/opportunities/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const db = getDb();
    await db.collection(COLLECTIONS.opportunities).deleteOne({ id });
    await db.collection(COLLECTIONS.events).deleteMany({ opportunityId: id });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
