import * as userService from '../services/userService.js';

export async function listUsers(_req, res) {
  res.json(await userService.listUsers());
}

export async function createUser(req, res) {
  res.status(201).json(await userService.createUserAccount(req.body || {}));
}

export async function updateUser(req, res) {
  res.json(await userService.updateUserAccount(Number(req.params.id), req.body || {}));
}

export async function deleteUser(req, res) {
  await userService.deleteUserAccount(Number(req.params.id));
  res.json({ ok: true });
}
