import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981','#f59e0b','#3b82f6','#ef4444'];

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/analytics').then((r) => setData(r.data)); }, []);
  const pie = (data?.recsByType || []).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Recommendations by type</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border rounded p-4 text-sm">Total farms: <b>{data?.farms ?? 0}</b></div>
    </div>
  );
}
