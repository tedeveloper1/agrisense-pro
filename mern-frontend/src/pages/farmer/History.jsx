import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function History() {
  const [data, setData] = useState({ recommendations: [], iot: [] });
  useEffect(() => { api.get('/history/user').then((r) => setData(r.data)); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">History</h1>
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Recommendations ({data.recommendations.length})</h2>
        <ul className="text-sm space-y-1">
          {data.recommendations.map((r) => <li key={r._id}>• {new Date(r.createdAt).toLocaleString()} — {r.title}</li>)}
        </ul>
      </div>
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Sensor readings ({data.iot.length})</h2>
        <ul className="text-sm space-y-1 max-h-72 overflow-auto">
          {data.iot.map((d) => <li key={d._id}>{new Date(d.timestamp).toLocaleString()} — moisture {d.soilMoisture}%, temp {d.temperature}°C</li>)}
        </ul>
      </div>
    </div>
  );
}
