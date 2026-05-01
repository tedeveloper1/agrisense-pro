import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Advisories() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/expert/advisories').then((r) => setItems(r.data.advisories)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Advisories</h1>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a._id} className="bg-white border rounded p-3 text-sm">
            <div className="font-semibold">{a.title}</div>
            <div className="text-gray-600">{a.message}</div>
            <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {!items.length && <div className="text-gray-400">No advisories yet.</div>}
      </div>
    </div>
  );
}
