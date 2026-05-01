import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function IoTStatus() {
  const [latest, setLatest] = useState(null);
  useEffect(() => { api.get('/iot/latest').then((r) => setLatest(r.data.latest)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">IoT Status</h1>
      {!latest ? <div className="text-gray-500">No sensor data yet.</div> : (
        <div className="bg-white border rounded-lg p-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div><div className="text-gray-500">Device</div><div className="font-medium">{latest.deviceId}</div></div>
          <div><div className="text-gray-500">Soil moisture</div><div className="font-medium">{latest.soilMoisture}%</div></div>
          <div><div className="text-gray-500">Temperature</div><div className="font-medium">{latest.temperature}°C</div></div>
          <div><div className="text-gray-500">Humidity</div><div className="font-medium">{latest.humidity}%</div></div>
          <div><div className="text-gray-500">Rainfall</div><div className="font-medium">{latest.rainfall} mm</div></div>
        </div>
      )}
    </div>
  );
}
