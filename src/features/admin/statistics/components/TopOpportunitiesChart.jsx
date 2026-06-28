import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { STATS_PALETTE } from '../constants';
import { ChartTooltip, EmptyState, SectionCard, Skeleton } from './StatsUi';

export default function TopOpportunitiesChart({ opportunities, loading, emptyLabel, title }) {
  const height = Math.max(220, opportunities.length * 40 + 40);
  return (
    <SectionCard title={title}>
      {loading ? <Skeleton className="h-64" /> : !opportunities.length ? <EmptyState label={emptyLabel} /> : (
        <div dir="ltr"><ResponsiveContainer width="100%" height={height}>
          <BarChart data={opportunities} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="title" width={140} tickFormatter={value => value?.length > 22 ? `${value.slice(0, 21)}…` : value} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={26}>{opportunities.map((item, index) => <Cell key={item.id} fill={STATS_PALETTE[index % STATS_PALETTE.length]} />)}</Bar>
          </BarChart>
        </ResponsiveContainer></div>
      )}
    </SectionCard>
  );
}
