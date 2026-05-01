import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Weather() {
  const [w, setW] = useState(null);
  const [forecast, setForecast] = useState([]);
  useEffect(() => {
    api.get('/weather/current').then((r) => setW(r.data.weather));
    api.get('/weather/forecast').then((r) => setForecast(r.data.forecast));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Weather</h1>
      {w && (
        <div className="bg-white border rounded p-4">
          <div className="text-3xl font-semibold">{w.temperature}°C</div>
          <div className="text-gray-600">{w.condition} · humidity {w.humidity}% · rainfall {w.rainfall} mm</div>
          <div className="text-xs text-gray-400">Region: {w.region} · {w.source}</div>
        </div>
      )}
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-2">Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          {forecast.map((d, i) => (
            <div key={i} className="border rounded p-2 text-center">
              <div className="text-gray-500 text-xs">{new Date(d.date).toLocaleDateString()}</div>
              <div className="font-medium">{d.temperature}°C</div>
              <div className="text-xs">{d.condition}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
