import { useState, useEffect } from 'react';
import api from '../services/api';

export function useLiveIoT(deviceId = 'farm-node-001', intervalMs = 15000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        const res = await api.get(`/iot/latest?deviceId=${deviceId}`);
        if (mounted) { setData(res.data); setLoading(false); }
      } catch (e) {
        if (mounted) setError(e.message);
      }
    };

    fetch();
    const timer = setInterval(fetch, intervalMs);
    return () => { mounted = false; clearInterval(timer); };
  }, [deviceId, intervalMs]);

  return { data, loading, error };
}