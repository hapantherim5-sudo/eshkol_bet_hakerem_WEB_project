import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { username, password } = req.body || {};
  const user = await authService.login(username, password);
  res.json(user);
}

export async function register(req, res) {
  const user = await authService.register(req.body || {});
  res.status(201).json(user);
}
