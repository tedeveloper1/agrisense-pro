import { useEffect, useState } from 'react';
import { Database } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function FarmData() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/expert/farm-data').then((r) => setItems(r.data.farms || [])).catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Farm data" description="Latest sensor snapshots from every farm under your supervision." />

      <div className="surface overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Database} title="No farm data yet" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)]">
                <th className="px-5 py-3 font-medium">Farm</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Soil moisture</th>
                <th className="px-5 py-3 font-medium">Temperature</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.farm._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition">
                  <td className="px-5 py-3 font-medium">{row.farm.name}</td>
                  <td className="px-5 py-3 text-muted">{row.farm.owner?.name}</td>
                  <td className="px-5 py-3">{row.latest?.soilMoisture != null ? `${row.latest.soilMoisture}%` : '—'}</td>
                  <td className="px-5 py-3">{row.latest?.temperature != null ? `${row.latest.temperature}°C` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
