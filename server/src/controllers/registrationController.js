import * as registrationService from '../services/registrationService.js';

export async function register(req, res) {
  const registration = await registrationService.register({
    ...(req.body || {}),
    userId: req.user.id,
  });
  res.status(201).json({ ok: true, registration });
}

export async function unregister(req, res) {
  await registrationService.unregister({
    ...(req.body || {}),
    userId: req.user.id,
  });
  res.json({ ok: true });
}
