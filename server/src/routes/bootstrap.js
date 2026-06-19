import { Router } from 'express';
import { getDb, COLLECTIONS } from '../database/db.js';

const router = Router();

router.get('/bootstrap', async (_req, res) => {
  const db = getDb();
  const [opportunities, events, registrations, cancellations, views, profileDocs] =
    await Promise.all([
      db.collection(COLLECTIONS.opportunities).find().sort({ id: 1 }).toArray(),
      db.collection(COLLECTIONS.events).find().sort({ id: 1 }).toArray(),
      db.collection(COLLECTIONS.registrations).find().toArray(),
      db.collection(COLLECTIONS.cancellations).find().toArray(),
      db.collection(COLLECTIONS.views).find().toArray(),
      db.collection(COLLECTIONS.profiles).find().toArray(),
    ]);
  const profiles = Object.fromEntries(profileDocs.map(p => [p.userId, p.data]));
  res.json({ opportunities, events, registrations, cancellations, views, profiles });
});

export default router;
