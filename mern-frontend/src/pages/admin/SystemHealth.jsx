import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function SystemHealth() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/system-health').then((r) => setData(r.data)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">System Health</h1>
      <pre className="bg-white border rounded p-4 text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
