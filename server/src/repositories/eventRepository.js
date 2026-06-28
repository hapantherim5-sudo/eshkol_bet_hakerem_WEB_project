import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

const events = () => getDb().collection(COLLECTIONS.events);

export function insert(event) {
  return events().insertOne(event);
}

export function deleteById(id) {
  return events().deleteOne({ id });
}

export function deleteByOpportunityId(opportunityId) {
  return events().deleteMany({ opportunityId });
}
