import { useEffect, useState } from 'react';
import {
  ShieldCheck, AlertTriangle, CalendarClock, Sprout, CloudRain, Thermometer,
  Droplets, Loader2, Sparkles, CheckCircle2, Bug, Wind, Sun,
} from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const LEVEL = {
  high: { ring: 'ring-rose-500/30', bar: 'bg-rose-500', tag: 'bg-rose-500/15 text-rose-500', label: 'High risk' },
  medium: { ring: 'ring-amber-500/30', bar: 'bg-amber-500', tag: 'bg-amber-500/15 text-amber-500', label: 'Watch' },
  low: { ring: 'ring-brand-500/30', bar: 'bg-brand-500', tag: 'bg-brand-500/15 text-brand-600 dark:text-brand-400', label: 'Protected' },
};

const HAZARD_ICON = {
  frost: Wind, heatwave: Sun, heavy_rain: CloudRain,
  drought: Droplets, humid_disease_window: Bug,
};

const CAT_ICON = {
  scout: Bug, protect: ShieldCheck, fertilize: Sprout,
  irrigate: Droplets, prune: CheckCircle2,
};

function RiskRing({ score, level }) {
  const cfg = LEVEL[level] || LEVEL.low;
  return (
    <div className={`relative h-20 w-20 rounded-full grid place-items-center ring-4 ${cfg.ring}`}>
      <div className="text-center">
        <div className="text-xl font-bold leading-none">{score}</div>
        <div className="text-[9px] uppercase tracking-wide text-muted">score</div>
      </div>
    </div>
  );
}

export default function Protection() {
  const [data, setData] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');

  const load = () =>
    Promise.all([
      api.get('/protection/overview'),
      api.get('/protection/calendar'),
    ]).then(([a, b]) => {
      setData(a.data); setCalendar(b.data.tasks || []);
    }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const runScan = async () => {
    setScanning(true); setScanMsg('');
    try {
      const { data } = await api.post('/protection/scan');
      setScanMsg(`Scan complete — ${data.alerts} alert(s) created, ${data.emailsSent} email(s) sent.`);
      load();
    } catch {
      setScanMsg('Scan failed. Try again.');
    } finally { setScanning(false); }
  };

  const farms = data?.farms || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Protection"
        description="Prevent problems before they happen — daily risk scoring, weather hazards, and a stage-aware action calendar."
        actions={
          <button onClick={runScan} disabled={scanning} className="btn-primary h-10 disabled:opacity-60">
            {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {scanning ? 'Scanning…' : 'Run protection scan'}
          </button>
        }
      />

      {scanMsg && (
        <div className="surface px-4 py-2 text-sm flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <CheckCircle2 className="h-4 w-4" /> {scanMsg}
        </div>
      )}

      {loading ? (
        <div className="surface p-10 grid place-items-center text-muted text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : farms.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No farms to protect yet"
          description="Add a farm and crops to start receiving daily protection scores and preventive actions."
        />
      ) : (
        <>
          {/* Risk per farm */}
          <div className="grid lg:grid-cols-2 gap-4">
            {farms.map((f) => {
              const overall = LEVEL[f.overallScore >= 70 ? 'high' : f.overallScore >= 40 ? 'medium' : 'low'];
              return (
                <div key={f.farm._id} className="surface p-5">
                  <div className="flex items-start gap-4">
                    <RiskRing
                      score={f.overallScore}
                      level={f.overallScore >= 70 ? 'high' : f.overallScore >= 40 ? 'medium' : 'low'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold truncate">{f.farm.name}</h3>
                        <span className={`badge ${overall.tag}`}>{overall.label}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted truncate">
                        {f.farm.location?.district || 'Rwanda'}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1"><Thermometer className="h-3.5 w-3.5" /> {f.weather.temperature}°C</span>
                        <span className="inline-flex items-center gap-1"><Droplets className="h-3.5 w-3.5" /> {f.weather.humidity}%</span>
                        <span className="inline-flex items-center gap-1"><CloudRain className="h-3.5 w-3.5" /> {f.weather.rainfall} mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Per-crop risk bars */}
                  <div className="mt-4 space-y-2">
                    {f.risks.map((r, i) => {
                      const cfg = LEVEL[r.level];
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="capitalize font-medium">{r.crop}{r.stage ? ` · ${r.stage}` : ''}</span>
                            <span className="text-muted">{r.score}/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                            <div className={`h-full ${cfg.bar}`} style={{ width: `${r.score}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hazards */}
                  {f.hazards.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {f.hazards.map((h) => {
                        const Icon = HAZARD_ICON[h.id] || AlertTriangle;
                        const tone = h.severity === 'critical'
                          ? 'border-rose-500/30 bg-rose-500/5'
                          : 'border-amber-500/30 bg-amber-500/5';
                        return (
                          <div key={h.id} className={`rounded-lg border ${tone} p-3`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Icon className="h-4 w-4" /> {h.title}
                              <span className="badge ml-auto bg-[var(--surface-2)] text-muted capitalize">{h.severity}</span>
                            </div>
                            <ul className="mt-1.5 text-xs text-muted list-disc list-inside space-y-0.5">
                              {h.actions.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preventive calendar */}
          <div className="surface p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="h-4 w-4 text-brand-500" />
              <h3 className="font-semibold">Preventive action calendar</h3>
              <span className="badge bg-[var(--surface-2)] text-muted ml-2">{calendar.length}</span>
            </div>
            {calendar.length === 0 ? (
              <div className="text-sm text-muted">No tasks scheduled yet.</div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {calendar.slice(0, 30).map((t) => {
                  const Icon = CAT_ICON[t.category] || ShieldCheck;
                  return (
                    <li key={t.id} className="py-3 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{t.title}</span>
                          <span className="badge bg-[var(--surface-2)] text-muted capitalize">{t.category}</span>
                        </div>
                        <div className="text-xs text-muted mt-0.5">{t.detail}</div>
                      </div>
                      <div className="text-xs text-muted shrink-0 whitespace-nowrap">
                        {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
