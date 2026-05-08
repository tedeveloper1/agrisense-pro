import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudSun, Droplets, Cloud, CloudRain, MapPin } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function Weather() {
  const { t } = useTranslation();
  const [w, setW] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/weather/current').then((r) => setW(r.data.weather)).catch(() => {}),
      api.get('/weather/forecast').then((r) => setForecast(r.data.forecast || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={t('weather.title')} description={t('weather.description')} />

      {loading ? (
        <div className="surface p-8"><div className="skel h-24 w-full" /></div>
      ) : !w ? (
        <EmptyState icon={CloudSun} title={t('weather.noData')} description={t('weather.noDataDesc')} />
      ) : (
        <div className="surface p-6 relative overflow-hidden bg-gradient-primary text-white">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <MapPin className="h-3.5 w-3.5" /> {w.region} · {w.source}
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-6xl font-bold tracking-tight">{w.temperature}°<span className="text-3xl text-white/60">C</span></div>
                <div className="text-white/80 capitalize">{w.condition}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-[260px]">
              <Mini icon={Droplets} label={t('dashboard.humidity')} value={`${w.humidity}%`} />
              <Mini icon={CloudRain} label={t('dashboard.rainfall')} value={`${w.rainfall} mm`} />
              <Mini icon={Cloud} label="Wind" value={`${w.windSpeed ?? 0} m/s`} />
            </div>
          </div>
        </div>
      )}

      <div className="surface p-5">
        <h2 className="font-semibold mb-4">{t('weather.fiveDay')}</h2>
        {forecast.length === 0 ? (
          <div className="text-sm text-muted py-4 text-center">{t('weather.noForecast')}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {forecast.map((d, i) => (
              <div
                key={i}
                className="surface-2 p-4 text-center hover:shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <div className="text-xs text-muted">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <CloudSun className="mx-auto my-2 h-7 w-7 text-brand-500" />
                <div className="text-xl font-semibold">{d.temperature}°</div>
                <div className="text-xs text-muted capitalize mt-0.5">{d.condition}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur p-3 ring-1 ring-white/15">
      <Icon className="h-4 w-4 text-white/80" />
      <div className="text-[10px] uppercase tracking-wider text-white/60 mt-2">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
