import * as users from '../repositories/userRepository.js';
import { createUser, createUserPatch, toSafeUser } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export function listUsers() {
  return users.findAll();
}

export async function createUserAccount(input) {
  const { name, username, password, role, organizationId } = input || {};
  if (!name?.trim() || !username?.trim() || !password?.trim() || !role) {
    throw new AppError(400, 'missing_fields');
  }
  if (await users.findByUsername(username.trim())) throw new AppError(409, 'username_taken');

  const id = await users.getNextUserId();
  const user = createUser({ id, name, username, password, role, organizationId });
  await users.insert(user);
  return toSafeUser(user);
}

export async function updateUserAccount(id, input) {
  assertValidId(id);
  const { username } = input || {};
  if (username?.trim() && await users.findUsernameConflict(username.trim(), id)) {
    throw new AppError(409, 'username_taken');
  }

  await users.updateById(id, createUserPatch(input || {}));
  const updated = await users.findSafeById(id);
  if (!updated) throw new AppError(404, 'not_found');
  return updated;
}

export async function deleteUserAccount(id) {
  assertValidId(id);
  const result = await users.deleteById(id);
  if (result.deletedCount === 0) throw new AppError(404, 'not_found');
}

function assertValidId(id) {
  if (Number.isNaN(id)) throw new AppError(400, 'invalid_id');
}
