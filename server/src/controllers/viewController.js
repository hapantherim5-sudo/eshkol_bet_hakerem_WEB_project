import { recordView } from '../services/viewService.js';

export async function createView(req, res) {
  const { opportunityId, userId = null } = req.body || {};
  const result = await recordView(opportunityId, userId);
  if (result.skipped) return res.json({ ok: true, skipped: true });
  return res.status(201).json(result.view);
}
