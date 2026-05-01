import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({ name: '', sizeHa: 0, soilType: 'loam' });
  const load = () => api.get('/farms').then((r) => setFarms(r.data.farms));
  useEffect(() => { load(); }, []);

  const add = async (e) => { e.preventDefault(); await api.post('/farms', form); setForm({ name:'', sizeHa:0, soilType:'loam' }); load(); };
  const del = async (id) => { await api.delete(`/farms/${id}`); load(); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Farms</h1>
      <form onSubmit={add} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded px-2 py-1" placeholder="Size (ha)" type="number" step="0.1" value={form.sizeHa} onChange={(e)=>setForm({...form,sizeHa:Number(e.target.value)})} />
        <select className="border rounded px-2 py-1" value={form.soilType} onChange={(e)=>setForm({...form,soilType:e.target.value})}>
          <option value="clay">Clay</option><option value="loam">Loam</option><option value="sandy">Sandy</option><option value="silt">Silt</option>
        </select>
        <button className="bg-brand-600 hover:bg-brand-700 text-white rounded px-3 py-1">Add farm</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="p-2">Name</th><th className="p-2">Size (ha)</th><th className="p-2">Soil</th><th className="p-2"></th></tr></thead>
          <tbody>
            {farms.map((f) => (
              <tr key={f._id} className="border-t">
                <td className="p-2 font-medium">{f.name}</td>
                <td className="p-2">{f.sizeHa}</td><td className="p-2">{f.soilType}</td>
                <td className="p-2 text-right"><button onClick={()=>del(f._id)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
            {!farms.length && <tr><td colSpan="4" className="p-4 text-center text-gray-400">No farms yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
