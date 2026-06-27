// File: server/src/routes/views.js
// Purpose: views script
// Role: API route handler for views

import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

router.post('/views', async (req, res, next) => {
  try {
    const { opportunityId, userId = null } = req.body || {};
    const db = getDb();
    const exists = await db.collection(COLLECTIONS.views).findOne({ opportunityId, userId });
    if (exists) return res.json({ ok: true, skipped: true });
    const entry = { opportunityId, userId, viewedAt: new Date().toISOString() };
    await db.collection(COLLECTIONS.views).insertOne(entry);
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

export default router;
