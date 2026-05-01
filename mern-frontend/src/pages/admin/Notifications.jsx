import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', channel: 'inapp', severity: 'info' });
  const load = () => api.get('/admin/notifications').then((r) => setItems(r.data.notifications));
  useEffect(() => { load(); }, []);
  const send = async (e) => { e.preventDefault(); await api.post('/admin/notifications/send', form); setForm({...form, title:'', message:''}); load(); };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <form onSubmit={send} className="bg-white border rounded p-4 grid md:grid-cols-4 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        <input className="border rounded px-2 py-1 md:col-span-2" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required />
        <select className="border rounded px-2 py-1" value={form.channel} onChange={(e)=>setForm({...form,channel:e.target.value})}>
          <option value="inapp">In-app</option><option value="sms">SMS</option><option value="email">Email</option>
        </select>
        <button className="bg-brand-600 text-white rounded py-1 md:col-span-4">Broadcast</button>
      </form>
      <div className="bg-white border rounded p-4 space-y-2 text-sm">
        {items.map((n) => <div key={n._id} className="border-b pb-2"><b>{n.title}</b> — {n.message} <span className="text-xs text-gray-400">({n.channel})</span></div>)}
      </div>
    </div>
  );
}
