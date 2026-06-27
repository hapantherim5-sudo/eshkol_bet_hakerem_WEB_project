// File: src/components/staff/StatsDashboard.jsx
// Purpose: StatsDashboard component
// Role: React component for StatsDashboard

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';
import { api } from '../../services/api';
import { useT } from '../../i18n/i18n';
import { getCityName } from '../../data/organizations';
import { CATEGORIES } from '../../data/opportunityOptions';

const PALETTE = [
  '#10b981','#06b6d4','#3b82f6','#8b5cf6',
  '#f59e0b','#ef4444','#84cc16','#f97316','#e879f9','#a78bfa',
];

// getLast12Months — handles getLast12Months
function getLast12Months(locale) {
  const now = new Date();
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${monthFormatter.format(d)} '${String(d.getFullYear()).slice(2)}`,
    };
  });
}

// computeLocalStats — handles computeLocalStats
function computeLocalStats(opportunities, registrations, cancellations, views, locale) {
  const months = getLast12Months(locale);

  // groupByMonth — handles groupByMonth
  const groupByMonth = (items, dateField) =>
    months.map(({ year, month, label }) => ({
      label,
      count: items.filter(item => {
        const d = new Date(item[dateField]);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      }).length,
    }));

  // groupBy — handles groupBy
  const groupBy = (items, keyFn) => {
    const map = {};
    items.forEach(item => {
      const key = keyFn(item);
      if (key) map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([k, v]) => ({ _key: k, count: v }))
      .sort((a, b) => b.count - a.count);
  };

  const regsByCity = groupBy(registrations, reg => {
    return opportunities.find(o => o.id === reg.opportunityId)?.city;
  }).map(r => ({ city: r._key, count: r.count }));

  const regsByCategory = groupBy(registrations, reg => {
    const opp = opportunities.find(o => o.id === reg.opportunityId);
    return opp?.category;
  }).map(r => ({ category: r._key, count: r.count }));

  const oppCounts = {};
  registrations.forEach(reg => {
    oppCounts[reg.opportunityId] = (oppCounts[reg.opportunityId] || 0) + 1;
  });
  const topOpps = Object.entries(oppCounts)
    .map(([id, count]) => {
      const opp = opportunities.find(o => o.id === Number(id));
      return { id: Number(id), title: opp?.title || `#${id}`, titleAr: opp?.titleAr, city: opp?.city, category: opp?.category, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalViews = views.length;
  const totalRegs = registrations.length;

  return {
    kpis: {
      totalUsers: null,
      totalOpportunities: opportunities.length,
      totalRegistrations: totalRegs,
      totalCancellations: cancellations.length,
      totalViews,
      activeOrganizations: new Set(opportunities.map(o => o.organizationId).filter(Boolean)).size,
    },
    registrationsByMonth: groupByMonth(registrations, 'createdAt'),
    cancellationsByMonth: groupByMonth(cancellations, 'cancelledAt'),
    registrationsByCity: regsByCity,
    registrationsByCategory: regsByCategory,
    topOpportunities: topOpps,
    usersByRole: null,
    conversionRate: {
      views: totalViews,
      registrations: totalRegs,
      rate: totalViews > 0 ? +((totalRegs / totalViews) * 100).toFixed(1) : 0,
    },
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

const KPI_META = [
  { key: 'totalUsers',          icon: 'users',     tone: 'neutral', labelKey: 'stats_users' },
  { key: 'totalOpportunities',  icon: 'clipboard', tone: 'neutral', labelKey: 'stats_opportunities' },
  { key: 'totalRegistrations',  icon: 'check',     tone: 'success', labelKey: 'stats_registrations' },
  { key: 'totalCancellations',  icon: 'close',     tone: 'danger',  labelKey: 'stats_cancellations' },
  { key: 'totalViews',          icon: 'eye',       tone: 'teal',    labelKey: 'stats_views' },
  { key: 'activeOrganizations', icon: 'building',  tone: 'neutral', labelKey: 'stats_active_organizations' },
];

// KpiIcon — renders KpiIcon
function KpiIcon({ type }) {
  const paths = {
    users: <><circle cx="9" cy="7" r="3" /><circle cx="17" cy="8" r="2.5" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14.5 20a4 4 0 0 1 5.5-3.7" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" /></>,
    check: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 2.5 2.5L16.5 9" /></>,
    close: <><circle cx="12" cy="12" r="8" /><path d="m9 9 6 6m0-6-6 6" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    building: <><path d="M4 21h16M6 21V5l6-2v18M18 21V9l-6-2M9 8h.01M9 12h.01M9 16h.01M13 8h.01M13 12h.01M13 16h.01" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

// KpiCard — renders KpiCard
function KpiCard({ icon, tone, value, label }) {
  return (
    <div className={`stats-kpi-card stats-kpi-card--${tone} bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="stats-kpi-icon w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50 mb-3">
        <KpiIcon type={icon} />
      </div>
      <div className="stats-kpi-value text-2xl sm:text-3xl font-black tabular-nums text-slate-800">
        {value !== null && value !== undefined ? value.toLocaleString() : '-'}
      </div>
      <div className="stats-kpi-label text-xs text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

// SectionCard — renders SectionCard
function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block" />
        {title}
      </h3>
      {children}
    </div>
  );
}

// BarTip — renders BarTip
function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-2.5 text-sm">
      <p className="font-semibold text-gray-600 text-xs mb-0.5">{label}</p>
      <p className="font-black text-gray-800 text-base">{payload[0].value}</p>
    </div>
  );
}

// PieTip — renders PieTip
function PieTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-2.5 text-sm">
      <p className="font-semibold text-gray-600 text-xs mb-0.5">{payload[0].name}</p>
      <p className="font-black text-gray-800 text-base">{payload[0].value}</p>
    </div>
  );
}

// Skeleton — renders Skeleton
function Skeleton({ h = 'h-52' }) {
  return (
    <div className={`${h} rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse`} />
  );
}

// Empty — renders Empty
function Empty({ label }) {
  return (
    <div className="h-40 flex flex-col items-center justify-center text-gray-300 gap-2">
      <span className="text-3xl">📭</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────

export default function StatsDashboard({ opportunities, registrations, cancellations, views, lang, showToast }) {
  const isAr = lang === 'ar';
  const t = useT(lang);
  const empty = t('stats_empty');
  const loadErrorMessage = t('stats_load_error');
  const locale = t('calendar_date_locale');

  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    let isActive = true;
    api.getStats()
      .then(stats => { if (isActive) setApiStats(stats); })
      .catch(() => {
        if (isActive) showToastRef.current(loadErrorMessage, 'error');
      })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, [lang, loadErrorMessage]);

  const localStats = useMemo(
    () => computeLocalStats(opportunities, registrations, cancellations, views, locale),
    [opportunities, registrations, cancellations, views, locale]
  );

  const rawStats = apiStats ?? localStats;
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  // localizeMonthSeries — handles localizeMonthSeries
  const localizeMonthSeries = (series = []) => series.map(item => item.label ? item : ({
    ...item,
    label: `${monthFormatter.format(new Date(item.year, item.month - 1, 1))} '${String(item.year).slice(2)}`,
  }));
  const stats = {
    ...rawStats,
    registrationsByMonth: localizeMonthSeries(rawStats.registrationsByMonth),
    cancellationsByMonth: localizeMonthSeries(rawStats.cancellationsByMonth),
    registrationsByCategory: (rawStats.registrationsByCategory ?? []).map(item => {
      const category = CATEGORIES.find(candidate => candidate.id === item.category);
      return {
        ...item,
        label: category ? t(category.labelKey) : t('other'),
      };
    }),
    topOpportunities: (rawStats.topOpportunities ?? []).map(item => ({
      ...item,
      title: isAr && item.titleAr ? item.titleAr : item.title,
    })),
  };
  const {
    kpis, registrationsByMonth, cancellationsByMonth,
    registrationsByCity, registrationsByCategory,
    topOpportunities, usersByRole, conversionRate,
  } = stats;

  const regsTotal = conversionRate.registrations;
  const viewsTotal = conversionRate.views;
  const convRate  = conversionRate.rate;

  // Horizontal bar chart height scales with item count
  const topBarH = Math.max(220, (topOpportunities?.length ?? 0) * 40 + 40);
  const cityChartData = (registrationsByCity ?? []).map(item => ({
    ...item,
    city: item.city === 'other' ? t('other') : getCityName(item.city, isAr),
  }));

  return (
    <div className="space-y-5 pb-4">

      {/* ── Section 1: KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_META.map(({ key, icon, tone, labelKey }) => (
          <KpiCard
            key={key}
            icon={icon}
            tone={tone}
            value={kpis[key]}
            label={t(labelKey)}
          />
        ))}
      </div>

      {/* ── Section 2 + 3: Monthly bar charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={t('stats_registrations_by_month')}>
          {loading ? <Skeleton /> : (
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={registrationsByMonth} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={1} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip content={<BarTip />} cursor={{ fill: '#f0fdf4' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title={t('stats_cancellations_by_month')}>
          {loading ? <Skeleton /> : (
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cancellationsByMonth} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={1} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip content={<BarTip />} cursor={{ fill: '#fff1f2' }} />
                  <Bar dataKey="count" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Section 4 + 5: Pie charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={t('stats_registrations_by_city')}>
        {loading ? <Skeleton /> : !cityChartData.length ? <Empty label={empty} /> : (
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={cityChartData}
                    dataKey="count"
                    nameKey="city"
                    cx="50%" cy="46%"
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => percent > 0.06 ? name : ''}
                    labelLine={false}
                  >
                    {cityChartData.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTip />} />
                  <Legend
                    formatter={val => <span style={{ fontSize: 13, color: '#4b5563' }}>{val}</span>}
                    iconSize={8}
                    wrapperStyle={{ paddingTop: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title={t('stats_registrations_by_category')}>
          {loading ? <Skeleton /> : !registrationsByCategory?.length ? <Empty label={empty} /> : (
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={registrationsByCategory}
                    dataKey="count"
                    nameKey="label"
                    cx="50%" cy="46%"
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => percent > 0.06 ? name : ''}
                    labelLine={false}
                  >
                    {registrationsByCategory.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTip />} />
                  <Legend
                    formatter={val => <span style={{ fontSize: 13, color: '#4b5563' }}>{val}</span>}
                    iconSize={8}
                    wrapperStyle={{ paddingTop: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Section 6: Top 10 Opportunities ── */}
      <SectionCard title={t('stats_top_opportunities')}>
        {loading ? <Skeleton h="h-64" /> : !topOpportunities?.length ? <Empty label={empty} /> : (
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={topBarH}>
              <BarChart
                data={topOpportunities}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={140}
                  tick={{ fontSize: 12, fill: '#374151' }}
                  tickFormatter={v => v?.length > 22 ? v.slice(0, 21) + '…' : v}
                />
                <Tooltip content={<BarTip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={26}>
                  {topOpportunities.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </SectionCard>

      {/* ── Section 7 + 8: Cities ranking + Conversion rate ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Section 7 – Cities ranking */}
        <SectionCard title={t('stats_top_cities')}>
          {loading ? <Skeleton h="h-44" /> : !registrationsByCity?.length ? <Empty label={empty} /> : (
            <div className="space-y-2.5">
              {registrationsByCity.map((item, i) => {
                const pct = registrationsByCity[0].count > 0
                  ? (item.count / registrationsByCity[0].count) * 100
                  : 0;
                return (
                  <div key={item.city} className="flex items-center gap-3 group">
                    <span className="w-5 text-[13px] font-bold text-gray-300 text-center shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-700 w-20 shrink-0">{getCityName(item.city, isAr)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
                      />
                    </div>
                    <span className="text-sm font-black text-gray-600 w-7 text-left shrink-0">{item.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Section 8 – Conversion rate */}
        <SectionCard title={t('stats_conversion_title')}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="stats-conversion-views bg-violet-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-violet-700">{viewsTotal.toLocaleString()}</div>
                <div className="text-xs text-violet-500 mt-1">{t('stats_views')}</div>
              </div>
              <div className="stats-conversion-registrations bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-700">{regsTotal.toLocaleString()}</div>
                <div className="text-xs text-emerald-500 mt-1">{t('stats_registrations')}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">{t('stats_conversion_rate')}</span>
                <span className="stats-conversion-rate text-2xl font-black text-blue-600">{convRate}%</span>
              </div>
              <div className="stats-conversion-track w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-l from-blue-500 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${Math.min(convRate, 100)}%` }}
                />
              </div>
              <p className="stats-conversion-note text-xs text-gray-400 mt-2 text-center">
                {t('stats_conversion_note')}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Section 10: User distribution ── */}
      <SectionCard title={t('stats_users_by_role')}>
        {loading ? <Skeleton h="h-44" /> : !usersByRole?.length ? (
          <Empty label={t('stats_roles_require_api')} />
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div dir="ltr" className="w-full sm:w-64 shrink-0">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="count"
                    nameKey="role"
                    cx="50%" cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {usersByRole.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {usersByRole.map((item, i) => (
                <div key={item.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                    <span className="text-sm font-semibold text-gray-700">{t(`role_${item.role.toLowerCase()}`)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${usersByRole.reduce((s, r) => s + r.count, 0) > 0 ? (item.count / usersByRole.reduce((s, r) => s + r.count, 0)) * 100 : 0}%`,
                          backgroundColor: PALETTE[i % PALETTE.length],
                        }}
                      />
                    </div>
                    <span className="text-sm font-black text-gray-600 w-6 text-center">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

    </div>
  );
}
