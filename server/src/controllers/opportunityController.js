import * as opportunityService from '../services/opportunityService.js';

export async function createOpportunity(req, res) {
  res.status(201).json(await opportunityService.addOpportunity(req.body || {}));
}

export async function updateOpportunity(req, res) {
  res.json(await opportunityService.updateOpportunity(Number(req.params.id), req.body || {}));
}

export async function deleteOpportunity(req, res) {
  await opportunityService.deleteOpportunity(Number(req.params.id));
  res.json({ ok: true });
}
