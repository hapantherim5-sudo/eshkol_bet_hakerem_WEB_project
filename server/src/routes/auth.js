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
    res.json(safe);
    console.log('[auth] response sent  username=%s', username);
  } catch (err) {
    console.error('[auth] login error  username=%s  error=%s  stack=%s', username, err.message, err.stack);
    next(err);
  }
});

export default router;
