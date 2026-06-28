import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { STATS_PALETTE } from '../constants';
import { ChartTooltip, EmptyState, SectionCard, Skeleton } from './StatsUi';

export default function DistributionCharts({ cities, categories, loading, emptyLabel, t }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DistributionChart title={t('stats_registrations_by_city')} data={cities} nameKey="city" loading={loading} emptyLabel={emptyLabel} />
      <DistributionChart title={t('stats_registrations_by_category')} data={categories} nameKey="label" loading={loading} emptyLabel={emptyLabel} />
    </div>
  );
}

function DistributionChart({ title, data, nameKey, loading, emptyLabel }) {
  return (
    <SectionCard title={title}>
      {loading ? <Skeleton /> : !data.length ? <EmptyState label={emptyLabel} /> : (
        <div dir="ltr"><ResponsiveContainer width="100%" height={260}>
          <PieChart><Pie data={data} dataKey="count" nameKey={nameKey} cx="50%" cy="46%" outerRadius={90} paddingAngle={2}>
            {data.map((item, index) => <Cell key={item[nameKey]} fill={STATS_PALETTE[index % STATS_PALETTE.length]} />)}
          </Pie><Tooltip content={<ChartTooltip />} /><Legend iconSize={8} /></PieChart>
        </ResponsiveContainer></div>
      )}
    </SectionCard>
  );
}
