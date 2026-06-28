import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip, SectionCard, Skeleton } from './StatsUi';

export default function MonthlyCharts({ registrations, cancellations, loading, t }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <MonthlyChart title={t('stats_registrations_by_month')} data={registrations} color="#10b981" loading={loading} />
      <MonthlyChart title={t('stats_cancellations_by_month')} data={cancellations} color="#f43f5e" loading={loading} />
    </div>
  );
}

function MonthlyChart({ title, data, color, loading }) {
  return (
    <SectionCard title={title}>
      {loading ? <Skeleton /> : (
        <div dir="ltr"><ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={1} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" fill={color} radius={[5, 5, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer></div>
      )}
    </SectionCard>
  );
}
