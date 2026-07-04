import { loadBootstrapData } from '../repositories/bootstrapRepository.js';

export async function getBootstrapData(user) {
  const data = await loadBootstrapData();
  let registrations = [];
  let cancellations = [];
  let views = [];
  let profileDocs = [];

  if (user?.role === 'Admin') {
    ({ registrations, cancellations, views, profileDocs } = data);
  } else if (user?.role === 'Staff') {
    const manageableIds = new Set(data.opportunities
      .filter(opportunity => opportunity.organizationId === user.organizationId)
      .map(opportunity => opportunity.id));
    registrations = data.registrations.filter(item => manageableIds.has(item.opportunityId));
    cancellations = data.cancellations.filter(item => manageableIds.has(item.opportunityId));
    views = data.views.filter(item => manageableIds.has(item.opportunityId));
  } else if (user?.role === 'User') {
    registrations = data.registrations.filter(item => item.userId === user.id);
    cancellations = data.cancellations.filter(item => item.userId === user.id);
    views = data.views.filter(item => item.userId === user.id);
    profileDocs = data.profileDocs.filter(profile => profile.userId === user.id);
  }

  const profiles = Object.fromEntries(profileDocs.map(profile => [profile.userId, profile.data]));
  return {
    opportunities: data.opportunities,
    events: data.events,
    registrations,
    cancellations,
    views,
    profiles,
  };
}
