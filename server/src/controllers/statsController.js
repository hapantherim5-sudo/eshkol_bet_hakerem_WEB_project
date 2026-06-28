import { getStatistics } from '../services/statsService.js';

export async function showStats(_req, res) {
  res.json(await getStatistics());
}
