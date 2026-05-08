import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Droplets, Thermometer, Cloud, CloudRain, Radio, FlaskConical } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function IoTStatus() {
  const { t } = useTranslation();
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/iot/latest')
      .then((r) => setLatest(r.data.latest))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="IoT Status" description="Last reading from your connected devices." />

      {loading ? (
        <div className="surface p-8"><div className="skel h-24 w-full" /></div>
      ) : !latest ? (
        <EmptyState icon={Cpu} title="No sensor data yet" description="Pair a sensor or use the simulator to see live readings here." />
      ) : (
        <>
          <div className="surface p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Device {latest.deviceId}</div>
                <div className="text-xs text-muted">Last seen just now</div>
              </div>
            </div>
            <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" /> Online
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Tile icon={Droplets} label={t('dashboard.soilMoisture')} value={`${latest.soilMoisture ?? '—'}%`} accent="brand" />
            <Tile icon={Thermometer} label={t('dashboard.temperature')} value={`${latest.temperature ?? '—'}°C`} accent="amber" />
            <Tile icon={Cloud} label={t('dashboard.humidity')} value={`${latest.humidity ?? '—'}%`} accent="indigo" />
            <Tile icon={CloudRain} label={t('dashboard.rainfall')} value={`${latest.rainfall ?? 0} mm`} accent="rose" />
            <Tile
              icon={FlaskConical}
              label={t('dashboard.ph')}
              value={latest.ph != null ? latest.ph.toFixed(1) : '—'}
              accent={latest.ph == null ? 'indigo' : latest.ph < 5.5 || latest.ph > 7.8 ? 'rose' : 'brand'}
              hint={latest.ph == null ? 'no sensor' : latest.ph < 5.5 ? 'acidic' : latest.ph > 7.8 ? 'alkaline' : 'optimal'}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Tile({ icon: Icon, label, value, accent, hint }) {
  const map = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    amber: 'bg-amber-500/10 text-amber-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    rose: 'bg-rose-500/10 text-rose-500',
  };
  return (
    <div className="surface p-5 hover:shadow-elegant transition-all hover:-translate-y-0.5">
      <div className={`h-9 w-9 rounded-xl grid place-items-center ${map[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="text-[10px] text-muted mt-0.5 capitalize">{hint}</div>}
    </div>
  );
}
