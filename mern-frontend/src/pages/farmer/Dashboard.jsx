import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/farmer/dashboard').then((r) => setData(r.data)).catch(() => {});
    api.get('/history/user').then((r) => setHistory((r.data.iot || []).slice().reverse())).catch(() => {});
  }, []);

  const iot = data?.latestIot || {};
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.soilMoisture')} value={iot.soilMoisture != null ? `${iot.soilMoisture}%` : '—'} />
        <StatCard label={t('dashboard.temperature')} value={iot.temperature != null ? `${iot.temperature}°C` : '—'} />
        <StatCard label={t('dashboard.humidity')} value={iot.humidity != null ? `${iot.humidity}%` : '—'} />
        <StatCard label={t('dashboard.rainfall')} value={iot.rainfall != null ? `${iot.rainfall} mm` : '—'} />
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Sensor history</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={history.map((h) => ({ t: new Date(h.timestamp).toLocaleTimeString(), moisture: h.soilMoisture, temp: h.temperature }))}>
              <XAxis dataKey="t" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="moisture" stroke="#10b981" />
              <Line type="monotone" dataKey="temp" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">{t('nav.recommendations')}</h2>
          <ul className="space-y-2 text-sm">
            {(data?.recommendations || []).map((r) => (
              <li key={r._id} className="border-l-4 border-brand-500 pl-2">
                <div className="font-medium">{r.title}</div>
                <div className="text-gray-600">{r.message}</div>
              </li>
            ))}
            {!data?.recommendations?.length && <li className="text-gray-400">{t('common.empty')}</li>}
          </ul>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">{t('nav.alerts')}</h2>
          <ul className="space-y-2 text-sm">
            {(data?.alerts || []).map((a) => (
              <li key={a._id}>• <span className="font-medium">{a.title}:</span> {a.message}</li>
            ))}
            {!data?.alerts?.length && <li className="text-gray-400">{t('common.empty')}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
