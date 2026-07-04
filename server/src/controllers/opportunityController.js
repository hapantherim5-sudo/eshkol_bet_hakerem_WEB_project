import * as opportunityService from '../services/opportunityService.js';

export async function createOpportunity(req, res) {
  res.status(201).json(await opportunityService.addOpportunity(req.body || {}, req.user));
}

export async function updateOpportunity(req, res) {
  res.json(await opportunityService.updateOpportunity(Number(req.params.id), req.body || {}, req.user));
}

export async function deleteOpportunity(req, res) {
  await opportunityService.deleteOpportunity(Number(req.params.id), req.user);
  res.json({ ok: true });
}
