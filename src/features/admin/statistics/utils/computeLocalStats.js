export function computeLocalStats(opportunities, registrations, cancellations, views, locale) {
  const months = getLast12Months(locale);
  const groupByMonth = (items, dateField) => months.map(({ year, month, label }) => ({
    label,
    count: items.filter(item => {
      const date = new Date(item[dateField]);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    }).length,
  }));
  const groupBy = (items, keyFor) => {
    const counts = new Map();
    items.forEach(item => {
      const key = keyFor(item);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  };

  const opportunityFor = registration => opportunities.find(item => item.id === registration.opportunityId);
  const registrationsByCity = groupBy(registrations, item => opportunityFor(item)?.city)
    .map(item => ({ city: item.key, count: item.count }));
  const registrationsByCategory = groupBy(registrations, item => opportunityFor(item)?.category)
    .map(item => ({ category: item.key, count: item.count }));
  const topOpportunities = groupBy(registrations, item => item.opportunityId)
    .slice(0, 10)
    .map(item => {
      const opportunity = opportunities.find(candidate => candidate.id === Number(item.key));
      return { ...opportunity, id: Number(item.key), count: item.count, title: opportunity?.title || `#${item.key}` };
    });
  const totalViews = views.length;
  const totalRegistrations = registrations.length;

  return {
    kpis: {
      totalUsers: null,
      totalOpportunities: opportunities.length,
      totalRegistrations,
      totalCancellations: cancellations.length,
      totalViews,
      activeOrganizations: new Set(opportunities.map(item => item.organizationId).filter(Boolean)).size,
    },
    registrationsByMonth: groupByMonth(registrations, 'createdAt'),
    cancellationsByMonth: groupByMonth(cancellations, 'cancelledAt'),
    registrationsByCity,
    registrationsByCategory,
    topOpportunities,
    usersByRole: [],
    conversionRate: {
      views: totalViews,
      registrations: totalRegistrations,
      rate: totalViews ? +((totalRegistrations / totalViews) * 100).toFixed(1) : 0,
    },
  };
}

function getLast12Months(locale) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${formatter.format(date)} '${String(date.getFullYear()).slice(2)}`,
    };
  });
}
