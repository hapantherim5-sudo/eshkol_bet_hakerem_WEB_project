// File: server/src/routes/health.js
// Purpose: health script
// Role: API route handler for health

import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

export default router;
