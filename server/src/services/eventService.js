import * as events from '../repositories/eventRepository.js';
import * as opportunities from '../repositories/opportunityRepository.js';
import { nextId } from '../repositories/counterRepository.js';
import { createEvent } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function addEvent(input, user) {
  const opportunity = await requireManageableOpportunity(input?.opportunityId, user);
  if (!input?.startsAt || !String(input?.title || opportunity.title || '').trim()) {
    throw new AppError(400, 'missing_fields');
  }
  const id = await nextId('events');
  const event = createEvent(input, id);
  await events.insert(event);
  return event;
}

export async function deleteEvent(id, user) {
  assertValidId(id);
  const event = await events.findById(id);
  if (!event) throw new AppError(404, 'not_found');
  if (Number.isFinite(event.opportunityId)) {
    await requireManageableOpportunity(event.opportunityId, user);
  } else if (user?.role !== 'Admin') {
    throw new AppError(403, 'forbidden');
  }
  const result = await events.deleteById(id);
  if (result.deletedCount === 0) throw new AppError(404, 'not_found');
}

export async function replaceOpportunityEvents(opportunityId, eventDefinitions = [], user) {
  assertValidId(opportunityId);
  await requireManageableOpportunity(opportunityId, user);
  if (!Array.isArray(eventDefinitions)) throw new AppError(400, 'invalid_events');
  if (eventDefinitions.some(event => !event?.startsAt)) throw new AppError(400, 'missing_fields');
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

async function requireManageableOpportunity(id, user) {
  if (!Number.isFinite(id)) throw new AppError(400, 'invalid_opportunity_id');
  const opportunity = await opportunities.findById(id);
  if (!opportunity) throw new AppError(404, 'opportunity_not_found');
  if (user?.role === 'Admin') return opportunity;
  if (user?.role === 'Staff' && user.organizationId === opportunity.organizationId) return opportunity;
  throw new AppError(403, 'forbidden');
}
