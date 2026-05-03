import { useEffect, useState } from 'react';
import { Stethoscope, Sparkles, Loader2, AlertTriangle, ShieldCheck, Leaf, History } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const CROPS = ['maize', 'tomato', 'potato', 'cabbage', 'beans', 'onion'];
const SYMPTOMS = [
  'yellow_leaves', 'brown_spots', 'wilting', 'leaf_curl',
  'powdery_white', 'holes_in_leaves', 'stunted_growth', 'rotting_stem',
];

const SEVERITY = {
  high: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20',
  medium: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20',
  low: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20',
};

export default function DiseasePrediction() {
  const [form, setForm] = useState({ crop: 'maize', symptoms: [], imageUrl: '', notes: '' });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = () =>
    api.get('/predictions/disease/history').then((r) => setHistory(r.data.predictions || [])).catch(() => {});

  useEffect(() => { loadHistory(); }, []);

  const toggleSymptom = (s) =>
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true); setResult(null);
    try {
      const { data } = await api.post('/predictions/disease', form);
      setResult(data.prediction);
      loadHistory();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Prediction failed. Try again.');
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disease prediction"
        description="Diagnose maize & vegetable diseases from symptoms — get treatment guidance instantly."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={submit} className="surface p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">New diagnosis</h2>
              <p className="text-xs text-muted">Tell us what you observe — be specific.</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted">Crop</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CROPS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, crop: c })}
                  className={`badge !px-3 !py-1.5 capitalize cursor-pointer ${
                    form.crop === c
                      ? 'bg-brand-500 text-white'
                      : 'bg-[var(--surface-2)] text-muted hover:text-[var(--text)]'
                  }`}
                >
                  <Leaf className="h-3 w-3" /> {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted">Symptoms (select all that apply)</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SYMPTOMS.map((s) => {
                const active = form.symptoms.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`text-left text-xs rounded-lg border px-3 py-2 transition ${
                      active
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted">Photo URL (optional)</label>
            <input
              className="input mt-1"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted">Notes (optional)</label>
            <textarea
              className="input mt-1 min-h-[80px]"
              placeholder="Anything else? e.g. weather, age of plants…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {err && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-sm px-3 py-2">
              <AlertTriangle className="h-4 w-4" /> {err}
            </div>
          )}

          <button type="submit" disabled={busy || !form.symptoms.length} className="btn-primary h-11 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {busy ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <div className="surface p-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className={`badge ${SEVERITY[result.severity] || SEVERITY.low}`}>
                  {Math.round((result.confidence || 0) * 100)}% confidence
                </span>
                <span className="text-xs text-muted">{result.source}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold capitalize">
                {(result.label || 'unknown').replace(/_/g, ' ')}
              </h3>
              <p className="mt-1 text-sm text-muted">{result.description}</p>

              <div className="mt-4 surface-2 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Recommended treatment
                </div>
                <ul className="mt-2 text-sm space-y-1.5 list-disc list-inside text-[var(--text)]/90">
                  {(result.treatment || []).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="Awaiting diagnosis"
              description="Pick a crop and symptoms, then run analysis."
            />
          )}

          <div className="surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-muted" />
              <h3 className="font-semibold text-sm">Recent diagnoses</h3>
            </div>
            {history.length === 0 ? (
              <div className="text-xs text-muted">No history yet.</div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                {history.map((h) => (
                  <li key={h._id} className="text-xs flex items-center justify-between gap-2 border-b border-[var(--border)] pb-1.5 last:border-0">
                    <div className="min-w-0">
                      <div className="font-medium capitalize truncate">{(h.label || '—').replace(/_/g, ' ')}</div>
                      <div className="text-muted truncate">{h.payload?.crop} · {new Date(h.createdAt).toLocaleString()}</div>
                    </div>
                    <span className="badge bg-[var(--surface-2)] text-muted">{Math.round((h.confidence || 0) * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
