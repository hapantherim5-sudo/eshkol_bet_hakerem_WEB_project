import { Router } from 'express';
import { getDb, COLLECTIONS } from '../database/db.js';

const router = Router();

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const user = await getDb().collection(COLLECTIONS.users).findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const safe = { ...user };
  delete safe.password;
  res.json(safe);
});

export default router;
