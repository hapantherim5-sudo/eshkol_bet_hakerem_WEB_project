import { getStatistics } from '../services/statsService.js';

export async function showStats(req, res) {
  res.json(await getStatistics(req.user));
}
