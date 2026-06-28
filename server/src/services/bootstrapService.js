import { loadBootstrapData } from '../repositories/bootstrapRepository.js';

export async function getBootstrapData() {
  const data = await loadBootstrapData();
  const profiles = Object.fromEntries(data.profileDocs.map(profile => [profile.userId, profile.data]));
  return {
    opportunities: data.opportunities,
    events: data.events,
    registrations: data.registrations,
    cancellations: data.cancellations,
    views: data.views,
    profiles,
  };
}
