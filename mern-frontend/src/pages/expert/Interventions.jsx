import { useState } from 'react';
import api from '../../services/api';

export default function Interventions() {
  const [form, setForm] = useState({ userId: '', farmId: '', type: 'general', title: '', message: '', severity: 'medium' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    await api.post('/expert/interventions', form);
    setMsg('Intervention created.');
    setForm({ ...form, title: '', message: '' });
  };
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Interventions</h1>
      {msg && <div className="bg-brand-50 text-brand-700 p-2 rounded text-sm">{msg}</div>}
      <form onSubmit={submit} className="bg-white border rounded p-4 space-y-2">
        <input className="w-full border rounded px-2 py-1" placeholder="User ID" value={form.userId} onChange={(e)=>setForm({...form,userId:e.target.value})} required />
        <input className="w-full border rounded px-2 py-1" placeholder="Farm ID (optional)" value={form.farmId} onChange={(e)=>setForm({...form,farmId:e.target.value})} />
        <input className="w-full border rounded px-2 py-1" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        <textarea className="w-full border rounded px-2 py-1" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required />
        <select className="border rounded px-2 py-1" value={form.severity} onChange={(e)=>setForm({...form,severity:e.target.value})}>
          <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
        </select>
        <button className="bg-brand-600 text-white px-3 py-1 rounded">Send</button>
      </form>
    </div>
  );
}
