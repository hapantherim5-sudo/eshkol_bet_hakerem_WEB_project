import { FAKE_USERS } from '../data/fakeData';

/** צפייה אחת לכל משתמש (או אורח) לכל הזדמנות */
function aggregateUniqueViews(views) {
  const seen = new Set();
  const viewsByOpp = {};
  views.forEach(v => {
    const key = `${v.opportunityId}:${v.userId ?? 'guest'}`;
    if (seen.has(key)) return;
    seen.add(key);
    viewsByOpp[v.opportunityId] = (viewsByOpp[v.opportunityId] || 0) + 1;
  });
  return { viewsByOpp, totalViews: seen.size };
}

export function computeStats({ opportunities, views, registrations, profiles, cancellations = [] }) {
  const { viewsByOpp, totalViews } = aggregateUniqueViews(views);

  const regsByOpp = {};
  registrations.forEach(r => {
    regsByOpp[r.opportunityId] = (regsByOpp[r.opportunityId] || 0) + 1;
  });

  const cancellationsByOpp = {};
  cancellations.forEach(c => {
    cancellationsByOpp[c.opportunityId] = (cancellationsByOpp[c.opportunityId] || 0) + 1;
  });

  const bySettlement = {};
  registrations.forEach(r => {
    const p = profiles[r.userId];
    const key = p?.settlement || '—';
    bySettlement[key] = (bySettlement[key] || 0) + 1;
  });

  const byInterest = {};
  Object.values(profiles).forEach(p => {
    (p.interests || []).forEach(i => {
      byInterest[i] = (byInterest[i] || 0) + 1;
    });
  });

  const topOpps = [...opportunities]
    .map(o => ({
      id: o.id,
      title: o.title,
      views: viewsByOpp[o.id] || 0,
      registrations: regsByOpp[o.id] || 0,
      cancellations: cancellationsByOpp[o.id] || 0,
    }))
    .sort((a, b) => b.registrations - a.registrations || b.views - a.views)
    .slice(0, 5);

  return {
    userCount: FAKE_USERS.length,
    totalViews,
    totalRegistrations: registrations.length,
    totalCancellations: cancellations.length,
    bySettlement,
    byInterest,
    topOpps,
  };
}
