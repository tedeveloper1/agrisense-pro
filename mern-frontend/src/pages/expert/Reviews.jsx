import { useEffect, useState } from 'react';
import { Check, X, Edit3, ClipboardCheck } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const SEVERITY = {
  high: 'bg-rose-500/15 text-rose-500',
  medium: 'bg-amber-500/15 text-amber-500',
  low: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
};

export default function Reviews() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/expert/reviews').then((r) => setItems(r.data.reviews || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const act = async (id, status, message='') => {
    await api.post(`/expert/recommendations/${id}/override`, { status, message });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Approve, dismiss or override AI-generated recommendations." />

      {items.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="All caught up!" description="No pending recommendations to review." />
      ) : (
        <div className="grid gap-3">
          {items.map((r) => (
            <div key={r._id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${SEVERITY[r.severity] || SEVERITY.low}`}>{r.severity || 'info'}</span>
                    <h3 className="font-semibold">{r.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted">{r.message}</p>
                </div>
                <div className="text-xs text-muted shrink-0 text-right">
                  <div className="font-medium text-[var(--text)]">{r.user?.name}</div>
                  <div>{r.farm?.name}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => act(r._id, 'approved')} className="btn-primary !h-8 text-xs">
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button onClick={() => act(r._id, 'dismissed')} className="btn-outline !h-8 text-xs">
                  <X className="h-3.5 w-3.5" /> Dismiss
                </button>
                <button
                  onClick={() => { const m = prompt('Override message:'); if (m) act(r._id, 'approved', m); }}
                  className="btn-outline !h-8 text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Override
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
