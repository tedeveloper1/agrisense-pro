import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

export default function ExpertDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/expert/dashboard').then((r) => setData(r.data)); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expert Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending reviews" value={data?.pending} />
      </div>
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Recent recommendations</h2>
        <ul className="text-sm space-y-1">
          {(data?.recent || []).map((r) => (
            <li key={r._id}>• <b>{r.title}</b> — {r.user?.name} <span className="text-gray-400">[{r.status}]</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
