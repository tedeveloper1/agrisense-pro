import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tractor, UserCheck, Cpu, Bell } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import { PageSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  const c = data?.counts || {};
  const dist = (data?.cropDistribution || []).map((d) => ({ name: d._id, count: d.count }));

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.dashboard')} description="Platform-wide overview and health." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Tractor} label={t('dashboard.totalFarmers')} value={c.farmers} accent="brand" />
        <StatCard icon={UserCheck} label={t('dashboard.totalExperts')} value={c.experts} accent="indigo" />
        <StatCard icon={Cpu} label={t('dashboard.activeDevices')} value={c.devices} accent="amber" />
        <StatCard icon={Bell} label={t('dashboard.alertsSent')} value={c.alerts} accent="rose" />
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Crop distribution</h2>
            <p className="text-xs text-muted">Across all registered farms.</p>
          </div>
        </div>
        {dist.length === 0 ? (
          <EmptyState title="No crops registered yet" description="Once farmers add crops, distribution will appear here." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={dist} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="bar" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.2)" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(16,185,129,0.08)' }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="url(#bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
