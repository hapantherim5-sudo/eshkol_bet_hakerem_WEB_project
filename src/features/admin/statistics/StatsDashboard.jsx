import { useCallback, useMemo } from 'react';
import { CATEGORIES } from '../../../data/opportunityOptions';
import { getCityName } from '../../../data/organizations';
import { useT } from '../../../i18n/i18n';
import DistributionCharts from './components/DistributionCharts';
import KpiGrid from './components/KpiGrid';
import MonthlyCharts from './components/MonthlyCharts';
import StatisticsSummary from './components/StatisticsSummary';
import TopOpportunitiesChart from './components/TopOpportunitiesChart';
import { useStatistics } from './hooks/useStatistics';
import { computeLocalStats } from './utils/computeLocalStats';

export default function StatsDashboard({ opportunities, registrations, cancellations, views, lang, showToast }) {
  const t = useT(lang);
  const isArabic = lang === 'ar';
  const locale = t('calendar_date_locale');
  const loadErrorMessage = t('stats_load_error');
  const handleError = useCallback(() => showToast(loadErrorMessage, 'error'), [loadErrorMessage, showToast]);
  const { statistics: remoteStats, loading } = useStatistics({ lang, onError: handleError });
  const localStats = useMemo(
    () => computeLocalStats(opportunities, registrations, cancellations, views, locale),
    [opportunities, registrations, cancellations, views, locale]
  );

  const rawStats = remoteStats || localStats;
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  const localizeMonths = (series = []) => series.map(item => item.label ? item : ({
    ...item,
    label: `${monthFormatter.format(new Date(item.year, item.month - 1, 1))} '${String(item.year).slice(2)}`,
  }));
  const cities = (rawStats.registrationsByCity || []).map(item => ({
    ...item,
    city: item.city === 'other' ? t('other') : getCityName(item.city, isArabic),
  }));
  const categories = (rawStats.registrationsByCategory || []).map(item => {
    const category = CATEGORIES.find(candidate => candidate.id === item.category);
    return { ...item, label: category ? t(category.labelKey) : t('other') };
  });
  const topOpportunities = (rawStats.topOpportunities || []).map(item => ({
    ...item,
    title: isArabic && item.titleAr ? item.titleAr : item.title,
  }));

  return (
    <div className="space-y-5 pb-4">
      <KpiGrid kpis={rawStats.kpis} t={t} />
      <MonthlyCharts
        registrations={localizeMonths(rawStats.registrationsByMonth)}
        cancellations={localizeMonths(rawStats.cancellationsByMonth)}
        loading={loading}
        t={t}
      />
      <DistributionCharts cities={cities} categories={categories} loading={loading} emptyLabel={t('stats_empty')} t={t} />
      <TopOpportunitiesChart opportunities={topOpportunities} loading={loading} emptyLabel={t('stats_empty')} title={t('stats_top_opportunities')} />
      <StatisticsSummary
        cities={cities}
        conversion={rawStats.conversionRate}
        usersByRole={rawStats.usersByRole || []}
        loading={loading}
        t={t}
      />
    </div>
  );
}
