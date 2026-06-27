// File: server/src/routes/organizations.js
// Purpose: organizations script
// Role: API route handler for organizations

import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

router.get('/organizations', async (_req, res) => {
  const list = await getDb().collection(COLLECTIONS.organizations).find().toArray();
  res.json(list);
});

export default router;
