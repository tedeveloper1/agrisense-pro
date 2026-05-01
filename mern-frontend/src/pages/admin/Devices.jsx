import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Devices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ deviceId: '', label: '' });
  const load = () => api.get('/admin/devices').then((r) => setItems(r.data.devices));
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); await api.post('/admin/devices', form); setForm({deviceId:'',label:''}); load(); };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Devices</h1>
      <form onSubmit={add} className="bg-white border rounded p-4 flex gap-2">
        <input className="border rounded px-2 py-1" placeholder="Device ID" value={form.deviceId} onChange={(e)=>setForm({...form,deviceId:e.target.value})} required />
        <input className="border rounded px-2 py-1" placeholder="Label" value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} />
        <button className="bg-brand-600 hover:bg-brand-700 text-white rounded px-3">Register</button>
      </form>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="p-2">Device</th><th className="p-2">Status</th><th className="p-2">Last seen</th></tr></thead>
          <tbody>
            {items.map((d) => <tr key={d._id} className="border-t"><td className="p-2 font-medium">{d.deviceId} <span className="text-gray-500">{d.label}</span></td><td className="p-2">{d.status}</td><td className="p-2">{d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : '—'}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
