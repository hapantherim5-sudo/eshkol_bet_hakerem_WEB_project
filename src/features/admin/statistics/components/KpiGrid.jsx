const KPI_META = [
  ['totalUsers', '👥', 'stats_users'],
  ['totalOpportunities', '📋', 'stats_opportunities'],
  ['totalRegistrations', '✓', 'stats_registrations'],
  ['totalCancellations', '×', 'stats_cancellations'],
  ['totalViews', '◉', 'stats_views'],
  ['activeOrganizations', '⌂', 'stats_active_organizations'],
];

export default function KpiGrid({ kpis, t }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {KPI_META.map(([key, icon, label]) => (
        <div key={key} className="stats-kpi-card rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="stats-kpi-icon mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-black text-emerald-600">{icon}</div>
          <div className="stats-kpi-value text-2xl font-black tabular-nums text-slate-800 sm:text-3xl">{kpis[key]?.toLocaleString?.() ?? '-'}</div>
          <div className="stats-kpi-label mt-1 text-xs font-medium text-gray-500">{t(label)}</div>
        </div>
      ))}
    </div>
  );
}
