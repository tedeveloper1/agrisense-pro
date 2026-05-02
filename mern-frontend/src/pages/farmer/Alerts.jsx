import { useEffect, useState } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const SEVERITY = {
  high: { ring: 'ring-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-500' },
  medium: { ring: 'ring-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-500' },
  low: { ring: 'ring-brand-500/30', bg: 'bg-brand-500/10', text: 'text-brand-600 dark:text-brand-400' },
};

export default function Alerts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/alerts/user')
      .then((r) => setItems(r.data.alerts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" description="Time-sensitive notifications about your farm." />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface p-5 space-y-2">
              <div className="skel h-4 w-1/3" />
              <div className="skel h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : !items.length ? (
        <EmptyState icon={Bell} title="All clear" description="No active alerts. We'll notify you the moment something needs attention." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => {
            const s = SEVERITY[a.severity] || SEVERITY.low;
            return (
              <div key={a._id} className={`surface p-5 ring-1 ${s.ring}`}>
                <div className="flex gap-3 items-start">
                  <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.text} grid place-items-center shrink-0`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold">{a.title}</div>
                      <span className={`badge ${s.bg} ${s.text}`}>{a.severity}</span>
                    </div>
                    <p className="text-sm text-muted mt-1">{a.message}</p>
                    <div className="text-xs text-muted mt-2">{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
