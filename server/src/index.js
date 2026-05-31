import express from 'express';
import cors from 'cors';
import { connectDb, getDb, COLLECTIONS } from './db.js';

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(cors());
app.use(express.json());

async function nextId(counterKey) {
  const db = getDb();
  const doc = await db.collection(COLLECTIONS.counters).findOneAndUpdate(
    {},
    { $inc: { [counterKey]: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return doc[counterKey];
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/organizations', async (_req, res) => {
  const list = await getDb().collection(COLLECTIONS.organizations).find().toArray();
  res.json(list);
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const user = await getDb().collection(COLLECTIONS.users).findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const { password: _p, ...safe } = user;
  res.json(safe);
});

app.get('/api/bootstrap', async (_req, res) => {
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

app.post('/api/opportunities', async (req, res) => {
  const id = await nextId('opportunities');
  const item = { ...req.body, id };
  await getDb().collection(COLLECTIONS.opportunities).insertOne(item);
  res.status(201).json(item);
});

app.put('/api/opportunities/:id', async (req, res) => {
  const id = Number(req.params.id);
  const opp = { ...req.body, id };
  await getDb().collection(COLLECTIONS.opportunities).replaceOne({ id }, opp, { upsert: true });
  res.json(opp);
});

app.delete('/api/opportunities/:id', async (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  await db.collection(COLLECTIONS.opportunities).deleteOne({ id });
  await db.collection(COLLECTIONS.events).deleteMany({ opportunityId: id });
  res.json({ ok: true });
});

app.post('/api/events', async (req, res) => {
  const id = await nextId('events');
  const item = { ...req.body, id };
  await getDb().collection(COLLECTIONS.events).insertOne(item);
  res.status(201).json(item);
});

app.delete('/api/events/:id', async (req, res) => {
  await getDb().collection(COLLECTIONS.events).deleteOne({ id: Number(req.params.id) });
  res.json({ ok: true });
});

app.put('/api/events/by-opportunity/:opportunityId', async (req, res) => {
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
});

app.post('/api/views', async (req, res) => {
  const { opportunityId, userId = null } = req.body || {};
  const db = getDb();
  const exists = await db.collection(COLLECTIONS.views).findOne({ opportunityId, userId });
  if (exists) return res.json({ ok: true, skipped: true });
  const entry = { opportunityId, userId, viewedAt: new Date().toISOString() };
  await db.collection(COLLECTIONS.views).insertOne(entry);
  res.status(201).json(entry);
});

app.post('/api/registrations', async (req, res) => {
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
});

app.delete('/api/registrations', async (req, res) => {
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
});

app.get('/api/profiles/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  const doc = await getDb().collection(COLLECTIONS.profiles).findOne({ userId });
  res.json(doc?.data || null);
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
