import { Router } from 'express';
import { getDb, COLLECTIONS } from '../database/db.js';

const router = Router();

router.post('/views', async (req, res) => {
  const { opportunityId, userId = null } = req.body || {};
  const db = getDb();
  const exists = await db.collection(COLLECTIONS.views).findOne({ opportunityId, userId });
  if (exists) return res.json({ ok: true, skipped: true });
  const entry = { opportunityId, userId, viewedAt: new Date().toISOString() };
  await db.collection(COLLECTIONS.views).insertOne(entry);
  res.status(201).json(entry);
});

export default router;
