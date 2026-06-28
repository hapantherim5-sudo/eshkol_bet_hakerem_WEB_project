import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

export async function nextId(counterKey) {
  const doc = await getDb().collection(COLLECTIONS.counters).findOneAndUpdate(
    {},
    { $inc: { [counterKey]: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return doc[counterKey];
}
