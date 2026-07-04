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

/**
 * Return the next counter value after first advancing the counter to at least
 * `floor`. This is useful when introducing a counter for an existing
 * collection whose documents already have numeric IDs.
 */
export async function nextIdAtLeast(counterKey, floor = 0) {
  const counters = getDb().collection(COLLECTIONS.counters);
  await counters.updateOne(
    {},
    { $max: { [counterKey]: floor } },
    { upsert: true }
  );
  const doc = await counters.findOneAndUpdate(
    {},
    { $inc: { [counterKey]: 1 } },
    { returnDocument: 'after' }
  );
  return doc[counterKey];
}
