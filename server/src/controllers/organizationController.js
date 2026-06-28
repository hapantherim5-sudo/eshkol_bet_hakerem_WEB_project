import { listOrganizations } from '../services/organizationService.js';

export async function list(_req, res) {
  res.json(await listOrganizations());
}
