import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

/* ── GET all users (passwords excluded) ── */
router.get('/users', async (req, res, next) => {
  try {
    const users = await getDb()
      .collection(COLLECTIONS.users)
      .find({}, { projection: { password: 0, _id: 0 } })
      .sort({ id: 1 })
      .toArray();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/* ── POST create user ── */
router.post('/users', async (req, res, next) => {
  try {
    const { name, username, password, role, organizationId } = req.body || {};
    if (!name?.trim() || !username?.trim() || !password?.trim() || !role) {
      return res.status(400).json({ error: 'missing_fields' });
    }
    const db = getDb();
    const existing = await db.collection(COLLECTIONS.users).findOne({ username: username.trim() });
    if (existing) return res.status(409).json({ error: 'username_taken' });

    /* Derive next id from the current maximum — safe for admin-only, low-concurrency use */
    const lastUser = await db.collection(COLLECTIONS.users)
      .find({}, { projection: { id: 1, _id: 0 } })
      .sort({ id: -1 })
      .limit(1)
      .next();
    const id = (lastUser?.id ?? 0) + 1;

    const user = {
      id,
      name: name.trim(),
      username: username.trim(),
      password: password.trim(),
      role,
      ...(organizationId ? { organizationId } : {}),
    };
    await db.collection(COLLECTIONS.users).insertOne(user);
    const { password: _pw, _id, ...safe } = user;
    res.status(201).json(safe);
  } catch (err) {
    next(err);
  }
});

/* ── PUT update user ── */
router.put('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });

    const { name, username, password, role, organizationId } = req.body || {};
    const db = getDb();

    if (username?.trim()) {
      const conflict = await db.collection(COLLECTIONS.users)
        .findOne({ username: username.trim(), id: { $ne: id } });
      if (conflict) return res.status(409).json({ error: 'username_taken' });
    }

    const patch = {};
    if (name?.trim())     patch.name     = name.trim();
    if (username?.trim()) patch.username = username.trim();
    if (password?.trim()) patch.password = password.trim();
    if (role)             patch.role     = role;
    /* organizationId: allow explicit empty string to clear it */
    if (organizationId !== undefined) patch.organizationId = organizationId || null;

    await db.collection(COLLECTIONS.users).updateOne({ id }, { $set: patch });
    const updated = await db.collection(COLLECTIONS.users)
      .findOne({ id }, { projection: { password: 0, _id: 0 } });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/* ── DELETE user ── */
router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid_id' });
    const result = await getDb().collection(COLLECTIONS.users).deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
