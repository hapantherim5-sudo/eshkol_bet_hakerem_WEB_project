import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

router.get('/profiles/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  const doc = await getDb().collection(COLLECTIONS.profiles).findOne({ userId });
  res.json(doc?.data || null);
});

export default router;
