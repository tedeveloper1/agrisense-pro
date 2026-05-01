import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function FarmData() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/expert/farm-data').then((r) => setItems(r.data.farms)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Farm Data</h1>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="p-2">Farm</th><th className="p-2">Owner</th><th className="p-2">Soil moisture</th><th className="p-2">Temp</th></tr></thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.farm._id} className="border-t">
                <td className="p-2">{row.farm.name}</td>
                <td className="p-2">{row.farm.owner?.name}</td>
                <td className="p-2">{row.latest?.soilMoisture ?? '—'}{row.latest && '%'}</td>
                <td className="p-2">{row.latest?.temperature ?? '—'}{row.latest && '°C'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
