import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';
import { nextId } from '../middleware/counter.js';

const router = Router();

router.post('/registrations', async (req, res, next) => {
  try {
    const { userId, opportunityId, profilePatch } = req.body || {};
    const db = getDb();
    const dup = await db.collection(COLLECTIONS.registrations).findOne({ userId, opportunityId });
    if (dup) return res.status(409).json({ ok: false, reason: 'duplicate' });

    const id = await nextId('registrations');
    const reg = { id, userId, opportunityId, createdAt: new Date().toISOString() };
    await db.collection(COLLECTIONS.registrations).insertOne(reg);

    if (profilePatch) {
      const existing = await db.collection(COLLECTIONS.profiles).findOne({ userId });
      const data = { ...(existing?.data || {}), ...profilePatch };
      await db.collection(COLLECTIONS.profiles).updateOne(
        { userId },
        { $set: { userId, data } },
        { upsert: true }
      );
    }
    res.status(201).json({ ok: true, registration: reg });
  } catch (err) { next(err); }
});

router.delete('/registrations', async (req, res, next) => {
  try {
    const { userId, opportunityId } = req.body || {};
    const db = getDb();
    const result = await db.collection(COLLECTIONS.registrations).deleteOne({ userId, opportunityId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ ok: false, reason: 'not_found' });
    }
    const id = await nextId('cancellations');
    const cancelEntry = { id, userId, opportunityId, cancelledAt: new Date().toISOString() };
    await db.collection(COLLECTIONS.cancellations).insertOne(cancelEntry);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
