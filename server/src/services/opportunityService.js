import * as opportunities from '../repositories/opportunityRepository.js';
import * as events from '../repositories/eventRepository.js';
import * as registrations from '../repositories/registrationRepository.js';
import * as views from '../repositories/viewRepository.js';
import { nextId } from '../repositories/counterRepository.js';
import { createOpportunity } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function addOpportunity(input, user) {
  validateOpportunity(input);
  assertCanManageOrganization(user, input.organizationId);
  const id = await nextId('opportunities');
  const opportunity = createOpportunity(input, id);
  await opportunities.insert(opportunity);
  return opportunity;
}

export async function updateOpportunity(id, input, user) {
  assertValidId(id);
  const existing = await opportunities.findById(id);
  if (!existing) throw new AppError(404, 'not_found');
  assertCanManageOrganization(user, existing.organizationId);
  validateOpportunity(input);
  assertCanManageOrganization(user, input.organizationId);
  const opportunity = createOpportunity(input, id);
  const result = await opportunities.replaceById(id, opportunity);
  if (result.matchedCount === 0) throw new AppError(404, 'not_found');
  return opportunity;
}

export async function deleteOpportunity(id, user) {
  assertValidId(id);
  const existing = await opportunities.findById(id);
  if (!existing) throw new AppError(404, 'not_found');
  assertCanManageOrganization(user, existing.organizationId);
  const result = await opportunities.deleteById(id);
  if (result.deletedCount === 0) throw new AppError(404, 'not_found');
  await Promise.all([
    events.deleteByOpportunityId(id),
    registrations.deleteByOpportunityId(id),
    views.deleteByOpportunityId(id),
  ]);
}

function assertValidId(id) {
  if (Number.isNaN(id)) throw new AppError(400, 'invalid_id');
}

function validateOpportunity(input = {}) {
  const required = ['title', 'titleAr', 'organizationId', 'city'];
  if (required.some(field => !String(input[field] || '').trim())) {
    throw new AppError(400, 'missing_fields');
  }
  const hasCurrentSchedule = input.startDate && input.endDate && input.time && input.endTime;
  const hasLegacySchedule = input.eventDate && (input.startTime || input.time);
  if (!hasCurrentSchedule && !hasLegacySchedule) throw new AppError(400, 'missing_schedule');
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    throw new AppError(400, 'invalid_date_range');
  }
  if (input.time && input.endTime && input.endTime <= input.time) {
    throw new AppError(400, 'invalid_time_range');
  }
}

function assertCanManageOrganization(user, organizationId) {
  if (user?.role === 'Admin') return;
  if (user?.role === 'Staff' && user.organizationId === organizationId) return;
  throw new AppError(403, 'forbidden');
}
