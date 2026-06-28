import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const profiles = () => getDb().collection(COLLECTIONS.profiles);

export function findByUserId(userId) {
  return profiles().findOne({ userId });
}

export function upsert(userId, data) {
  return profiles().updateOne({ userId }, { $set: { userId, data } }, { upsert: true });
}
