import { loadStatsData } from '../repositories/statsRepository.js';

export async function getStatistics() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const raw = await loadStatsData(twelveMonthsAgo);

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  });
  const fillMonths = values => months.map(({ year, month }) => ({
    year,
    month,
    count: values.find(item => item._id.y === year && item._id.m === month)?.count ?? 0,
  }));

  return {
    kpis: {
      totalUsers: raw.totalUsers,
      totalOpportunities: raw.totalOpportunities,
      totalRegistrations: raw.totalRegistrations,
      totalCancellations: raw.totalCancellations,
      totalViews: raw.totalViews,
      activeOrganizations: raw.activeOrganizations.filter(Boolean).length,
    },
    registrationsByMonth: fillMonths(raw.registrationsByMonth),
    cancellationsByMonth: fillMonths(raw.cancellationsByMonth),
    registrationsByCity: raw.registrationsByCity.map(item => ({ city: item._id || 'other', count: item.count })),
    registrationsByCategory: raw.registrationsByCategory.map(item => ({ category: item._id || 'other', count: item.count })),
    topOpportunities: raw.topOpportunities,
    usersByRole: raw.usersByRole.map(item => ({ role: item._id || 'other', count: item.count })),
    conversionRate: {
      views: raw.totalViews,
      registrations: raw.totalRegistrations,
      rate: raw.totalViews > 0
        ? +((raw.totalRegistrations / raw.totalViews) * 100).toFixed(1)
        : 0,
    },
  };
}
