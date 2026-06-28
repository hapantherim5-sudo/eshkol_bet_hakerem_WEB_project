import * as users from '../repositories/userRepository.js';
import { createUser, toSafeUser } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function login(username, password) {
  const user = await users.findByCredentials(username, password);
  if (!user) throw new AppError(401, 'invalid_credentials');
  return toSafeUser(user);
}

export async function register({ name, username, password }) {
  if (!name?.trim() || !username?.trim() || !password?.trim()) {
    throw new AppError(400, 'missing_fields');
  }
  if (password.trim().length < 4) throw new AppError(400, 'password_too_short');

  const normalizedUsername = username.trim();
  if (await users.findByUsername(normalizedUsername)) {
    throw new AppError(409, 'username_taken');
  }

  const id = await users.getNextUserId();
  const user = createUser({ id, name, username, password, role: 'User' });
  await users.insert(user);
  return toSafeUser(user);
}
