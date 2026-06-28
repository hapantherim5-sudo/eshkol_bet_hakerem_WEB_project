import * as opportunities from '../repositories/opportunityRepository.js';
import * as events from '../repositories/eventRepository.js';
import { nextId } from '../repositories/counterRepository.js';
import { createOpportunity } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function addOpportunity(input) {
  const id = await nextId('opportunities');
  const opportunity = createOpportunity(input, id);
  await opportunities.insert(opportunity);
  return opportunity;
}

export async function updateOpportunity(id, input) {
  assertValidId(id);
  const opportunity = createOpportunity(input, id);
  await opportunities.replaceById(id, opportunity);
  return opportunity;
}

export async function deleteOpportunity(id) {
  assertValidId(id);
  await opportunities.deleteById(id);
  await events.deleteByOpportunityId(id);
}

function assertValidId(id) {
  if (Number.isNaN(id)) throw new AppError(400, 'invalid_id');
}
