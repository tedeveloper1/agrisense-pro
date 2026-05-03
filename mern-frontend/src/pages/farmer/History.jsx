import { useEffect, useState } from 'react';
import { History as HistoryIcon, Lightbulb, Activity } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function History() {
  const [data, setData] = useState({ recommendations: [], iot: [] });
  useEffect(() => { api.get('/history/user').then((r) => setData(r.data)).catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="History" description="Your full activity log: AI recommendations and sensor readings." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Section icon={Lightbulb} title="Recommendations" count={data.recommendations.length}>
          {data.recommendations.length === 0 ? (
            <EmptyState title="No recommendations yet" />
          ) : (
            <ul className="text-sm divide-y divide-[var(--border)]">
              {data.recommendations.map((r) => (
                <li key={r._id} className="py-2.5 flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.title}</div>
                    <div className="text-xs text-muted">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section icon={Activity} title="Sensor readings" count={data.iot.length}>
          {data.iot.length === 0 ? (
            <EmptyState title="No sensor data yet" />
          ) : (
            <ul className="text-sm divide-y divide-[var(--border)] max-h-96 overflow-auto">
              {data.iot.map((d) => (
                <li key={d._id} className="py-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">{new Date(d.timestamp).toLocaleString()}</span>
                  <span className="text-xs">
                    💧 {d.soilMoisture}% · 🌡 {d.temperature}°C
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, count, children }) {
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="font-semibold">{title}</h2>
        </div>
        <span className="badge bg-[var(--surface-2)] text-muted">{count}</span>
      </div>
      {children}
    </div>
  );
}
