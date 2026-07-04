import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';
import { nextIdAtLeast } from './counterRepository.js';

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
  const db = getDb();
  const references = [
    [COLLECTIONS.users, 'id'],
    [COLLECTIONS.registrations, 'userId'],
    [COLLECTIONS.cancellations, 'userId'],
    [COLLECTIONS.views, 'userId'],
    [COLLECTIONS.profiles, 'userId'],
  ];
  const highestIds = await Promise.all(references.map(async ([collectionName, field]) => {
    const lastDocument = await db.collection(collectionName)
      .find({ [field]: { $type: 'number' } }, { projection: { [field]: 1, _id: 0 } })
      .sort({ [field]: -1 })
      .limit(1)
      .next();
    return lastDocument?.[field] ?? 0;
  }));

  // Include orphaned historical records in the floor so an old user ID can
  // never be assigned to a new account and make it inherit stale data.
  return nextIdAtLeast('users', Math.max(0, ...highestIds));
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

export async function deleteRelatedData(id) {
  const db = getDb();
  await Promise.all([
    db.collection(COLLECTIONS.registrations).deleteMany({ userId: id }),
    db.collection(COLLECTIONS.cancellations).deleteMany({ userId: id }),
    db.collection(COLLECTIONS.views).deleteMany({ userId: id }),
    db.collection(COLLECTIONS.profiles).deleteMany({ userId: id }),
  ]);
}
