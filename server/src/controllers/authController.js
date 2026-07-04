import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { username, password } = req.body || {};
  res.json(await authService.login(username, password));
}

export async function register(req, res) {
  const user = await authService.register(req.body || {});
  res.status(201).json(user);
}
