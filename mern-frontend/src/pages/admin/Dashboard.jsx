import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)); }, []);
  const c = data?.counts || {};
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.totalFarmers')} value={c.farmers} />
        <StatCard label={t('dashboard.totalExperts')} value={c.experts} />
        <StatCard label={t('dashboard.activeDevices')} value={c.devices} />
        <StatCard label={t('dashboard.alertsSent')} value={c.alerts} />
      </div>
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Crop distribution</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={(data?.cropDistribution || []).map(d => ({ name: d._id, count: d.count }))}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
