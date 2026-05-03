import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Tractor } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ef4444', '#ec4899'];

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/analytics').then((r) => setData(r.data)).catch(() => setData({})); }, []);
  const pie = (data?.recsByType || []).map((d) => ({ name: d._id, value: d.count }));
  const total = pie.reduce((s, x) => s + x.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform-wide performance and recommendation insights." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Tractor} label="Total farms" value={data?.farms ?? 0} accent="brand" />
        <StatCard icon={BarChart3} label="Recommendations" value={total} accent="indigo" />
      </div>

      <div className="surface p-5">
        <h2 className="font-semibold mb-4">Recommendations by type</h2>
        {pie.length === 0 ? (
          <EmptyState title="No data yet" description="Recommendations will populate once farmers receive insights." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} paddingAngle={2}>
                  {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--surface)" strokeWidth={2} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
