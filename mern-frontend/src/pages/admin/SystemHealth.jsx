import { useEffect, useState } from 'react';
import { Server, Database, Cpu, Activity } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

export default function SystemHealth() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/system-health').then((r) => setData(r.data)).catch(() => setData({})); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="System health" description="Infrastructure status, data volumes and connection health." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Server} label="API status" value={data?.api || 'OK'} accent="brand" />
        <StatCard icon={Database} label="Database" value={data?.db || 'connected'} accent="indigo" />
        <StatCard icon={Cpu} label="Devices online" value={data?.onlineDevices ?? '—'} accent="amber" />
        <StatCard icon={Activity} label="Uptime" value={data?.uptime || '—'} accent="rose" />
      </div>

      <div className="surface p-5">
        <h2 className="font-semibold mb-3">Raw payload</h2>
        <pre className="surface-2 p-4 text-xs overflow-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
