import { recordView } from '../services/viewService.js';

export async function createView(req, res) {
  const { opportunityId } = req.body || {};
  const result = await recordView(opportunityId, req.user?.id ?? null);
  if (result.skipped) return res.json({ ok: true, skipped: true });
  return res.status(201).json(result.view);
}
