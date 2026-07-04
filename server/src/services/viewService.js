import * as views from '../repositories/viewRepository.js';
import { createView } from '../models/entities.js';
import * as opportunities from '../repositories/opportunityRepository.js';
import { AppError } from '../utils/AppError.js';

export async function recordView(opportunityId, userId = null) {
  if (!Number.isFinite(opportunityId)) throw new AppError(400, 'invalid_opportunity_id');
  if (!await opportunities.findById(opportunityId)) throw new AppError(404, 'opportunity_not_found');
  if (await views.find(opportunityId, userId)) return { skipped: true };
  const view = createView(opportunityId, userId);
  await views.insert(view);
  return { skipped: false, view };
}
