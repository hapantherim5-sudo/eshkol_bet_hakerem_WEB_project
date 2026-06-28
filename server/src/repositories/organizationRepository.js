import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

export function findAll() {
  return getDb().collection(COLLECTIONS.organizations).find({}, { projection: { _id: 0 } }).toArray();
}
