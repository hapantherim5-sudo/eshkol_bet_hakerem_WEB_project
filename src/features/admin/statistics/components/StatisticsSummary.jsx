import { STATS_PALETTE } from '../constants';
import { EmptyState, SectionCard, Skeleton } from './StatsUi';

export default function StatisticsSummary({ cities, conversion, usersByRole, loading, t }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title={t('stats_top_cities')}>
          {loading ? <Skeleton className="h-44" /> : !cities.length ? <EmptyState label={t('stats_empty')} /> : (
            <div className="space-y-2.5">{cities.map((item, index) => {
              const percentage = cities[0].count ? (item.count / cities[0].count) * 100 : 0;
              return <div key={item.city} className="flex items-center gap-3"><span className="w-5 text-center text-xs font-bold text-gray-300">{index + 1}</span><span className="w-24 shrink-0 text-sm font-semibold text-gray-700">{item.city}</span><div className="h-2 flex-1 rounded-full bg-gray-100"><div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: STATS_PALETTE[index % STATS_PALETTE.length] }} /></div><span className="w-7 text-left text-sm font-black text-gray-600">{item.count}</span></div>;
            })}</div>
          )}
        </SectionCard>

        <SectionCard title={t('stats_conversion_title')}>
          <div className="space-y-5"><div className="grid grid-cols-2 gap-3"><Metric value={conversion.views} label={t('stats_views')} className="stats-conversion-views bg-violet-50 text-violet-700" /><Metric value={conversion.registrations} label={t('stats_registrations')} className="stats-conversion-registrations bg-emerald-50 text-emerald-700" /></div><div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-gray-600">{t('stats_conversion_rate')}</span><span className="stats-conversion-rate text-2xl font-black text-blue-600">{conversion.rate}%</span></div><div className="stats-conversion-track h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-3 rounded-full bg-gradient-to-l from-blue-500 to-emerald-500" style={{ width: `${Math.min(conversion.rate, 100)}%` }} /></div></div></div>
        </SectionCard>
      </div>

      <SectionCard title={t('stats_users_by_role')}>
        {loading ? <Skeleton className="h-32" /> : !usersByRole.length ? <EmptyState label={t('stats_roles_require_api')} /> : (
          <div className="grid gap-3 sm:grid-cols-3">{usersByRole.map((item, index) => <div key={item.role} className="rounded-xl bg-gray-50 p-4"><span className="mb-2 block h-2 w-10 rounded-full" style={{ backgroundColor: STATS_PALETTE[index % STATS_PALETTE.length] }} /><p className="text-sm font-semibold text-gray-600">{t(`role_${item.role.toLowerCase()}`)}</p><p className="text-2xl font-black text-gray-800">{item.count}</p></div>)}</div>
        )}
      </SectionCard>
    </>
  );
}

function Metric({ value, label, className }) {
  return <div className={`rounded-xl p-4 text-center ${className}`}><div className="text-2xl font-black">{value.toLocaleString()}</div><div className="mt-1 text-xs">{label}</div></div>;
}
