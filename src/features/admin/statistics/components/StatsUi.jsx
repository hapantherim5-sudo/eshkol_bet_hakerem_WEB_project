export function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
        <span className="inline-block h-4 w-1 rounded-full bg-emerald-500" />{title}
      </h3>
      {children}
    </section>
  );
}

export function Skeleton({ className = 'h-52' }) {
  return <div className={`${className} animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100`} />;
}

export function EmptyState({ label }) {
  return <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-300"><span className="text-3xl">📭</span><span className="text-sm">{label}</span></div>;
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm shadow-xl"><p className="text-xs font-semibold text-gray-600">{label || payload[0].name}</p><p className="text-base font-black text-gray-800">{payload[0].value}</p></div>;
}
