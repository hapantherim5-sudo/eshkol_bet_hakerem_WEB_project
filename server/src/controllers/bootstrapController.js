import { getBootstrapData } from '../services/bootstrapService.js';

export async function bootstrap(_req, res) {
  const data = await getBootstrapData();
  console.log(
    '[bootstrap] done  opp=%d ev=%d reg=%d',
    data.opportunities.length,
    data.events.length,
    data.registrations.length
  );
  res.json(data);
}
