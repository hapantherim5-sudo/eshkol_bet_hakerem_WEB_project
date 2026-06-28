import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const views = () => getDb().collection(COLLECTIONS.views);

export function find(opportunityId, userId) {
  return views().findOne({ opportunityId, userId });
}

export function insert(view) {
  return views().insertOne(view);
}
