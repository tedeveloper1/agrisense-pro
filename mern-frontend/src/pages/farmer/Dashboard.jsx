import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Droplets, Thermometer, Cloud, CloudRain, Lightbulb, Bell, ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { PageSkeleton } from '../../components/Skeleton';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const SEVERITY = {
  high: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20',
  medium: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20',
  low: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20',
};

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/farmer/dashboard').then((r) => setData(r.data)).catch(() => setData({})),
      api.get('/history/user').then((r) => setHistory((r.data.iot || []).slice().reverse())).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton rows={2} />;

  const iot = data?.latestIot || {};
  const chart = history.map((h) => ({
    t: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moisture: h.soilMoisture,
    temp: h.temperature,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t('nav.dashboard')} 👋`}
        description="Live farm conditions and recommended actions for today."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Droplets}
          label={t('dashboard.soilMoisture')}
          value={iot.soilMoisture != null ? `${iot.soilMoisture}%` : '—'}
          hint="Optimal 50–70%"
          accent="brand"
        />
        <StatCard
          icon={Thermometer}
          label={t('dashboard.temperature')}
          value={iot.temperature != null ? `${iot.temperature}°C` : '—'}
          accent="amber"
        />
        <StatCard
          icon={Cloud}
          label={t('dashboard.humidity')}
          value={iot.humidity != null ? `${iot.humidity}%` : '—'}
          accent="indigo"
        />
        <StatCard
          icon={CloudRain}
          label={t('dashboard.rainfall')}
          value={iot.rainfall != null ? `${iot.rainfall} mm` : '—'}
          hint="Last 24h"
          accent="rose"
        />
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Sensor history</h2>
            <p className="text-xs text-muted">Live readings from your connected devices</p>
          </div>
          <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" /> Live
          </span>
        </div>
        {chart.length === 0 ? (
          <EmptyState title="No sensor data yet" description="Connect a device or use the simulator to see data appear here." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={chart} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="m" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="te" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.2)" vertical={false} />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={2} fill="url(#m)" />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fill="url(#te)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section
          icon={Lightbulb}
          title={t('nav.recommendations')}
          accent="brand"
          empty={!data?.recommendations?.length}
        >
          <ul className="space-y-3">
            {(data?.recommendations || []).slice(0, 4).map((r) => (
              <li key={r._id} className="flex gap-3 items-start group">
                <span className={`mt-0.5 badge ${SEVERITY[r.severity] || SEVERITY.low}`}>{r.severity || 'info'}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{r.title}</div>
                  <div className="text-xs text-muted line-clamp-2">{r.message}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          icon={Bell}
          title={t('nav.alerts')}
          accent="rose"
          empty={!data?.alerts?.length}
        >
          <ul className="space-y-3">
            {(data?.alerts || []).slice(0, 4).map((a) => (
              <li key={a._id} className="flex gap-3 items-start">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-xs text-muted line-clamp-2">{a.message}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, accent, empty, children }) {
  const accentBg = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    rose: 'bg-rose-500/10 text-rose-500',
  }[accent];
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`h-9 w-9 rounded-xl grid place-items-center ${accentBg}`}>
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="font-semibold">{title}</h2>
        </div>
        <button className="btn-ghost rounded-lg !px-2 !py-1 text-xs">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {empty ? <div className="text-sm text-muted py-4 text-center">No items yet.</div> : children}
    </div>
  );
}
