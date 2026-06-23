import { getDb, COLLECTIONS } from '../db.js';

export async function nextId(counterKey) {
  const db = getDb();
  // MongoDB increments this value atomically to avoid duplicate numeric IDs.
  const doc = await db.collection(COLLECTIONS.counters).findOneAndUpdate(
    {},
    { $inc: { [counterKey]: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return doc[counterKey];
}
