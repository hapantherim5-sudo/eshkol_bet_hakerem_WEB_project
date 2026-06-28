import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

export async function loadBootstrapData() {
  const db = getDb();
  const [opportunities, events, registrations, cancellations, views, profileDocs] =
    await Promise.all([
      db.collection(COLLECTIONS.opportunities).find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray(),
      db.collection(COLLECTIONS.events).find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray(),
      db.collection(COLLECTIONS.registrations).find({}, { projection: { _id: 0 } }).toArray(),
      db.collection(COLLECTIONS.cancellations).find({}, { projection: { _id: 0 } }).toArray(),
      db.collection(COLLECTIONS.views).find({}, { projection: { _id: 0 } }).toArray(),
      db.collection(COLLECTIONS.profiles).find({}, { projection: { _id: 0 } }).toArray(),
    ]);

  return { opportunities, events, registrations, cancellations, views, profileDocs };
}
