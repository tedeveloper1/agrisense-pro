import { useEffect, useState } from 'react';
import { Send, Bell, Mail, MessageSquare, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const CHANNEL_BADGE = {
  inapp: 'bg-indigo-500/15 text-indigo-500',
  sms: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
  email: 'bg-amber-500/15 text-amber-500',
};

const SEVERITY_BADGE = {
  info: 'bg-sky-500/15 text-sky-500',
  warning: 'bg-amber-500/15 text-amber-600',
  critical: 'bg-rose-500/15 text-rose-500',
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', channel: 'inapp', severity: 'info' });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const load = () => api.get('/admin/notifications').then((r) => setItems(r.data.notifications || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const send = async (e) => {
    e.preventDefault();
    setBusy(true); setResult(null);
    try {
      const { data } = await api.post('/admin/notifications/send', form);
      setResult(data.delivery);
      setForm({ ...form, title: '', message: '' });
      load();
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Broadcast announcements across in-app, SMS or email channels." />

      <form onSubmit={send} className="surface p-5 grid md:grid-cols-4 gap-3">
        <input className="input" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        <input className="input md:col-span-2" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required />
        <select className="input" value={form.channel} onChange={(e)=>setForm({...form,channel:e.target.value})}>
          <option value="inapp">In-app</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
        <button className="btn-primary md:col-span-4"><Send className="h-4 w-4" /> Broadcast</button>
      </form>

      <div className="surface p-5">
        <h2 className="font-semibold mb-4">Recent broadcasts</h2>
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" />
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {items.map((n) => (
              <li key={n._id} className="py-3 flex items-start gap-3">
                <span className={`badge ${CHANNEL_BADGE[n.channel] || ''}`}>{n.channel}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-muted">{n.message}</div>
                </div>
                <span className="text-xs text-muted shrink-0">{new Date(n.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
