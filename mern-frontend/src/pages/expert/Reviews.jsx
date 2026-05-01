import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Reviews() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/expert/reviews').then((r) => setItems(r.data.reviews));
  useEffect(() => { load(); }, []);
  const act = async (id, status, message='') => { await api.post(`/expert/recommendations/${id}/override`, { status, message }); load(); };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r._id} className="bg-white border rounded p-3">
            <div className="flex justify-between"><div className="font-semibold">{r.title}</div>
              <div className="text-xs text-gray-500">{r.user?.name} · {r.farm?.name}</div></div>
            <div className="text-sm text-gray-600">{r.message}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>act(r._id, 'approved')} className="text-xs bg-brand-600 text-white px-2 py-1 rounded">Approve</button>
              <button onClick={()=>act(r._id, 'dismissed')} className="text-xs bg-gray-200 px-2 py-1 rounded">Dismiss</button>
              <button onClick={()=>{const m=prompt('Override message:'); if(m) act(r._id,'approved',m);}} className="text-xs bg-amber-500 text-white px-2 py-1 rounded">Override</button>
            </div>
          </div>
        ))}
        {!items.length && <div className="text-gray-400">No pending reviews.</div>}
      </div>
    </div>
  );
}
