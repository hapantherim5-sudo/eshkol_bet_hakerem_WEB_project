import * as events from '../repositories/eventRepository.js';
import { nextId } from '../repositories/counterRepository.js';
import { createEvent } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function addEvent(input) {
  const id = await nextId('events');
  const event = createEvent(input, id);
  await events.insert(event);
  return event;
}

export async function deleteEvent(id) {
  assertValidId(id);
  await events.deleteById(id);
}

export async function replaceOpportunityEvents(opportunityId, eventDefinitions = []) {
  assertValidId(opportunityId);
  await events.deleteByOpportunityId(opportunityId);

  const added = [];
  for (const definition of eventDefinitions) {
    const id = await nextId('events');
    const event = createEvent(definition, id, opportunityId);
    await events.insert(event);
    added.push(event);
  }
  return added;
}

function assertValidId(id) {
  if (Number.isNaN(id)) throw new AppError(400, 'invalid_id');
}
