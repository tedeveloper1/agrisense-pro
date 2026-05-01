import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/recommendations/user').then((r) => setItems(r.data.recommendations));
  useEffect(() => { load(); }, []);
  const generate = async () => { await api.post('/recommendations/user/generate'); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recommendations</h1>
        <button onClick={generate} className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded">Generate</button>
      </div>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r._id} className="bg-white border rounded p-3">
            <div className="flex justify-between"><div className="font-semibold">{r.title}</div>
              <span className={`text-xs px-2 py-0.5 rounded ${r.severity==='high'?'bg-red-100 text-red-700':r.severity==='medium'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-700'}`}>{r.severity}</span></div>
            <div className="text-sm text-gray-600">{r.message}</div>
            <div className="text-xs text-gray-400 mt-1">{r.type} · {r.source}</div>
          </div>
        ))}
        {!items.length && <div className="text-gray-400">No recommendations yet.</div>}
      </div>
    </div>
  );
}
