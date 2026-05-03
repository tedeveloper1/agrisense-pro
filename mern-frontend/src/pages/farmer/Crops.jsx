import { useEffect, useState } from 'react';
import { Wheat, Plus } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const STAGES = ['planning','planted','germination','vegetative','flowering','harvest','completed'];

const STAGE_BADGE = {
  planning: 'bg-[var(--surface-2)] text-muted',
  planted: 'bg-indigo-500/15 text-indigo-500',
  germination: 'bg-amber-500/15 text-amber-500',
  vegetative: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
  flowering: 'bg-pink-500/15 text-pink-500',
  harvest: 'bg-amber-600/15 text-amber-600',
  completed: 'bg-[var(--surface-2)] text-muted',
};

export default function Crops() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ farm: '', name: 'maize', stage: 'planning', areaHa: 0 });

  const load = async () => {
    const [f, c] = await Promise.all([api.get('/farms'), api.get('/crops')]);
    setFarms(f.data.farms || []); setCrops(c.data.crops || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.farm) return;
    await api.post('/crops', form);
    setForm({ farm: '', name: 'maize', stage: 'planning', areaHa: 0 });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Crops" description="Track each crop, its stage, and the area planted." />

      <form onSubmit={add} className="surface p-5 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select className="input" value={form.farm} onChange={(e)=>setForm({...form,farm:e.target.value})} required>
          <option value="">Select farm</option>
          {farms.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <input className="input" placeholder="Crop name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <select className="input" value={form.stage} onChange={(e)=>setForm({...form,stage:e.target.value})}>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="input" placeholder="Area (ha)" type="number" step="0.1" value={form.areaHa} onChange={(e)=>setForm({...form,areaHa:Number(e.target.value)})} />
        <button className="btn-primary"><Plus className="h-4 w-4" /> Add crop</button>
      </form>

      <div className="surface overflow-hidden">
        {crops.length === 0 ? (
          <EmptyState icon={Wheat} title="No crops yet" description="Add your first crop above to start tracking." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)]">
                <th className="px-5 py-3 font-medium">Crop</th>
                <th className="px-5 py-3 font-medium">Farm</th>
                <th className="px-5 py-3 font-medium">Stage</th>
                <th className="px-5 py-3 font-medium">Area (ha)</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition">
                  <td className="px-5 py-3 font-medium capitalize">{c.name}{c.variety && <span className="text-muted"> ({c.variety})</span>}</td>
                  <td className="px-5 py-3 text-muted">{c.farm?.name}</td>
                  <td className="px-5 py-3"><span className={`badge ${STAGE_BADGE[c.stage] || ''}`}>{c.stage}</span></td>
                  <td className="px-5 py-3">{c.areaHa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
