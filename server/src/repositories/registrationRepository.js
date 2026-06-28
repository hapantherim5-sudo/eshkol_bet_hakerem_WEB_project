import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const registrations = () => getDb().collection(COLLECTIONS.registrations);
const cancellations = () => getDb().collection(COLLECTIONS.cancellations);

export function find(userId, opportunityId) {
  return registrations().findOne({ userId, opportunityId });
}

export function insert(registration) {
  return registrations().insertOne(registration);
}

export function remove(userId, opportunityId) {
  return registrations().deleteOne({ userId, opportunityId });
}

export function insertCancellation(cancellation) {
  return cancellations().insertOne(cancellation);
}
