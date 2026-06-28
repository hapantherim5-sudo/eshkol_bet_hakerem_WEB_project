import * as registrations from '../repositories/registrationRepository.js';
import * as profiles from '../repositories/profileRepository.js';
import { nextId } from '../repositories/counterRepository.js';
import { createCancellation, createRegistration } from '../models/entities.js';
import { AppError } from '../utils/AppError.js';

export async function register({ userId, opportunityId, profilePatch }) {
  if (await registrations.find(userId, opportunityId)) {
    throw new AppError(409, 'duplicate', { ok: false, reason: 'duplicate' });
  }

  const registration = createRegistration(
    await nextId('registrations'),
    userId,
    opportunityId
  );
  await registrations.insert(registration);

  if (profilePatch) {
    const existing = await profiles.findByUserId(userId);
    await profiles.upsert(userId, { ...(existing?.data || {}), ...profilePatch });
  }
  return registration;
}

export async function unregister({ userId, opportunityId }) {
  const result = await registrations.remove(userId, opportunityId);
  if (result.deletedCount === 0) {
    throw new AppError(404, 'not_found', { ok: false, reason: 'not_found' });
  }

  const cancellation = createCancellation(
    await nextId('cancellations'),
    userId,
    opportunityId
  );
  await registrations.insertCancellation(cancellation);
}
