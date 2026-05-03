import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';

export default function Interventions() {
  const [form, setForm] = useState({ userId: '', farmId: '', type: 'general', title: '', message: '', severity: 'medium' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    await api.post('/expert/interventions', form);
    setMsg('Intervention sent successfully.');
    setForm({ ...form, title: '', message: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Interventions" description="Send a targeted advisory or directive to a farmer." />

      {msg && (
        <div className="flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300 text-sm px-3 py-2">
          <CheckCircle2 className="h-4 w-4" /> {msg}
        </div>
      )}

      <form onSubmit={submit} className="surface p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="User ID">
            <input className="input" value={form.userId} onChange={(e)=>setForm({...form,userId:e.target.value})} required />
          </Field>
          <Field label="Farm ID (optional)">
            <input className="input" value={form.farmId} onChange={(e)=>setForm({...form,farmId:e.target.value})} />
          </Field>
        </div>
        <Field label="Title">
          <input className="input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        </Field>
        <Field label="Message">
          <textarea className="input min-h-[120px]" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required />
        </Field>
        <Field label="Severity">
          <select className="input" value={form.severity} onChange={(e)=>setForm({...form,severity:e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>
        <button className="btn-primary"><Send className="h-4 w-4" /> Send intervention</button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
