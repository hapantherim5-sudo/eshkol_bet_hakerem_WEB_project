// File: server/src/routes/auth.js
// Purpose: auth script
// Role: API route handler for auth

import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

router.post('/auth/login', async (req, res, next) => {
  const { username, password } = req.body || {};
  console.log('[auth] login request received  username=%s', username);
  try {
    console.log('[auth] querying database...');
    const user = await getDb().collection(COLLECTIONS.users).findOne({ username, password });
    if (!user) {
      console.log('[auth] invalid credentials  username=%s', username);
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    console.log('[auth] login success  username=%s  role=%s', user.username, user.role);
    const safe = { ...user };
    delete safe.password;
    delete safe._id;
    res.json(safe);
    console.log('[auth] response sent  username=%s', username);
  } catch (err) {
    console.error('[auth] login error  username=%s  error=%s  stack=%s', username, err.message, err.stack);
    next(err);
  }
});

router.post('/auth/register', async (req, res, next) => {
  const { name, username, password } = req.body || {};
  console.log('[auth] register request received  username=%s', username);
  try {
    if (!name?.trim() || !username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'missing_fields' });
    }
    if (password.trim().length < 4) {
      return res.status(400).json({ error: 'password_too_short' });
    }
    const db = getDb();
    const existing = await db.collection(COLLECTIONS.users).findOne({ username: username.trim() });
    if (existing) {
      console.log('[auth] register failed – username taken  username=%s', username);
      return res.status(409).json({ error: 'username_taken' });
    }
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
      role: 'User',
    };
    await db.collection(COLLECTIONS.users).insertOne(user);
    console.log('[auth] register success  username=%s  id=%d', user.username, id);
    const safe = { id: user.id, name: user.name, username: user.username, role: user.role };
    res.status(201).json(safe);
  } catch (err) {
    console.error('[auth] register error  username=%s  error=%s', username, err.message);
    next(err);
  }
});

export default router;
