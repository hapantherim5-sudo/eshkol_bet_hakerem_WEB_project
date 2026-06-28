import { getProfile } from '../services/profileService.js';

export async function showProfile(req, res) {
  res.json(await getProfile(Number(req.params.userId)));
}
