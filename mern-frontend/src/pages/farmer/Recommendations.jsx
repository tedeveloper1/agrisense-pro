import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, Loader2 } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const SEVERITY = {
  high: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20',
  medium: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20',
  low: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20',
};

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/recommendations/user')
    .then((r) => setItems(r.data.recommendations || []))
    .catch(() => {})
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const generate = async () => {
    setBusy(true);
    try { await api.post('/recommendations/user/generate'); load(); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations"
        description="AI- and expert-driven actions tailored to your farm."
        actions={
          <button onClick={generate} disabled={busy} className="btn-primary disabled:opacity-70">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </button>
        }
      />

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
        <EmptyState
          icon={Lightbulb}
          title="No recommendations yet"
          description="Generate your first set of recommendations from current sensor and weather data."
          action={
            <button onClick={generate} className="btn-primary">
              <Sparkles className="h-4 w-4" /> Generate now
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((r) => (
            <div key={r._id} className="surface p-5 hover:shadow-elegant transition-all hover:-translate-y-0.5 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center shrink-0">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div className="font-semibold truncate">{r.title}</div>
                </div>
                <span className={`badge ${SEVERITY[r.severity] || SEVERITY.low}`}>{r.severity || 'info'}</span>
              </div>
              <p className="mt-3 text-sm text-muted">{r.message}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <span className="badge bg-[var(--surface-2)] ring-1 ring-[var(--border)]">{r.type}</span>
                <span>· {r.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
