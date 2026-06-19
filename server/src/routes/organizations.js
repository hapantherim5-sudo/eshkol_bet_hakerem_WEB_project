import { Router } from 'express';
import { getDb, COLLECTIONS } from '../database/db.js';

const router = Router();

router.get('/organizations', async (_req, res) => {
  const list = await getDb().collection(COLLECTIONS.organizations).find().toArray();
  res.json(list);
});

export default router;
