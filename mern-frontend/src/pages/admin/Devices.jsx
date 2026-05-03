import { useEffect, useState } from 'react';
import { Cpu, Plus } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const STATUS = {
  online: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
  offline: 'bg-rose-500/15 text-rose-500',
  unknown: 'bg-[var(--surface-2)] text-muted',
};

export default function Devices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ deviceId: '', label: '' });
  const load = () => api.get('/admin/devices').then((r) => setItems(r.data.devices || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    await api.post('/admin/devices', form);
    setForm({ deviceId: '', label: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Devices" description="Register and monitor IoT sensors deployed across farms." />

      <form onSubmit={add} className="surface p-5 grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Device ID" value={form.deviceId} onChange={(e)=>setForm({...form,deviceId:e.target.value})} required />
        <input className="input" placeholder="Label (e.g. Plot A sensor)" value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} />
        <button className="btn-primary"><Plus className="h-4 w-4" /> Register</button>
      </form>

      <div className="surface overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Cpu} title="No devices yet" description="Register your first IoT device above." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)]">
                <th className="px-5 py-3 font-medium">Device</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition">
                  <td className="px-5 py-3">
                    <div className="font-medium">{d.deviceId}</div>
                    <div className="text-xs text-muted">{d.label}</div>
                  </td>
                  <td className="px-5 py-3"><span className={`badge ${STATUS[d.status] || STATUS.unknown}`}>{d.status || 'unknown'}</span></td>
                  <td className="px-5 py-3 text-muted">{d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
