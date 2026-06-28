import * as views from '../repositories/viewRepository.js';
import { createView } from '../models/entities.js';

export async function recordView(opportunityId, userId = null) {
  if (await views.find(opportunityId, userId)) return { skipped: true };
  const view = createView(opportunityId, userId);
  await views.insert(view);
  return { skipped: false, view };
}
