import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Alerts() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/alerts/user').then((r) => setItems(r.data.alerts)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a._id} className="bg-white border rounded p-3">
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm text-gray-600">{a.message}</div>
            <div className="text-xs text-gray-400 mt-1">{a.severity} · {new Date(a.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {!items.length && <div className="text-gray-400">No alerts.</div>}
      </div>
    </div>
  );
}
