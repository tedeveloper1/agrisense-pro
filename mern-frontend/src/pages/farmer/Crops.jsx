import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Crops() {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ farm: '', name: 'maize', stage: 'planting', areaHa: 0 });
  const load = async () => {
    const [f, c] = await Promise.all([api.get('/farms'), api.get('/crops')]);
    setFarms(f.data.farms); setCrops(c.data.crops);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => { e.preventDefault(); await api.post('/crops', form); load(); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Crops</h1>
      <form onSubmit={add} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        <select className="border rounded px-2 py-1" value={form.farm} onChange={(e)=>setForm({...form,farm:e.target.value})} required>
          <option value="">Select farm</option>
          {farms.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <input className="border rounded px-2 py-1" placeholder="Crop" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <select className="border rounded px-2 py-1" value={form.stage} onChange={(e)=>setForm({...form,stage:e.target.value})}>
          {['planning','planted','germination','vegetative','flowering','harvest','completed'].map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="border rounded px-2 py-1" placeholder="Area (ha)" type="number" step="0.1" value={form.areaHa} onChange={(e)=>setForm({...form,areaHa:Number(e.target.value)})} />
        <button className="bg-brand-600 hover:bg-brand-700 text-white rounded px-3 py-1">Add</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="p-2">Crop</th><th className="p-2">Farm</th><th className="p-2">Stage</th><th className="p-2">Area</th></tr></thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-2 font-medium">{c.name} {c.variety && `(${c.variety})`}</td>
                <td className="p-2">{c.farm?.name}</td><td className="p-2">{c.stage}</td><td className="p-2">{c.areaHa}</td>
              </tr>
            ))}
            {!crops.length && <tr><td colSpan="4" className="p-4 text-center text-gray-400">No crops yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
