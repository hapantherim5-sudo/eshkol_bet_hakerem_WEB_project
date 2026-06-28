import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const opportunities = () => getDb().collection(COLLECTIONS.opportunities);

export function insert(opportunity) {
  return opportunities().insertOne(opportunity);
}

export function replaceById(id, opportunity) {
  return opportunities().replaceOne({ id }, opportunity, { upsert: true });
}

export function deleteById(id) {
  return opportunities().deleteOne({ id });
}
