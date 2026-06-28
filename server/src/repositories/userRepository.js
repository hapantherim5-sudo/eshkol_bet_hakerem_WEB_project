import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const users = () => getDb().collection(COLLECTIONS.users);

export function findByCredentials(username, password) {
  return users().findOne({ username, password });
}

export function findByUsername(username) {
  return users().findOne({ username });
}

export function findUsernameConflict(username, excludedId) {
  return users().findOne({ username, id: { $ne: excludedId } });
}

export async function getNextUserId() {
  const lastUser = await users()
    .find({}, { projection: { id: 1, _id: 0 } })
    .sort({ id: -1 })
    .limit(1)
    .next();
  return (lastUser?.id ?? 0) + 1;
}

export function findAll() {
  return users().find({}, { projection: { password: 0, _id: 0 } }).sort({ id: 1 }).toArray();
}

export function insert(user) {
  return users().insertOne(user);
}

export function updateById(id, patch) {
  return users().updateOne({ id }, { $set: patch });
}

export function findSafeById(id) {
  return users().findOne({ id }, { projection: { password: 0, _id: 0 } });
}

export function deleteById(id) {
  return users().deleteOne({ id });
}
