import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, hint, icon: Icon, trend, accent = 'brand' }) {
  const trendUp = trend && !trend.startsWith('-');
  const accentBg = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    amber: 'bg-amber-500/10 text-amber-500',
    rose: 'bg-rose-500/10 text-rose-500',
  }[accent] || 'bg-brand-500/10 text-brand-600';

  return (
    <div className="surface p-5 group hover:shadow-elegant transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
        {Icon && (
          <div className={`h-9 w-9 rounded-xl grid place-items-center ${accentBg}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value ?? '—'}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 ${
              trendUp ? 'text-brand-600 dark:text-brand-400' : 'text-rose-500'
            }`}
          >
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </div>
  );
}
