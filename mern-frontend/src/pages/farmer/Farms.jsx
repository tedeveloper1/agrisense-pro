import { useEffect, useState } from 'react';
import { Plus, Trash2, Tractor, Loader2 } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({ name: '', sizeHa: 0, soilType: 'loam' });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/farms')
    .then((r) => setFarms(r.data.farms || []))
    .catch(() => {})
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/farms', form);
      setForm({ name: '', sizeHa: 0, soilType: 'loam' });
      load();
    } finally { setBusy(false); }
  };
  const del = async (id) => { await api.delete(`/farms/${id}`); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Farms" description="Register and manage your farms and fields." />

      <form onSubmit={add} className="surface p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_160px_140px] gap-3">
          <div>
            <label className="text-xs font-medium text-muted">Name</label>
            <input
              className="input mt-1"
              placeholder="e.g. Kigali Plot A"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Size (ha)</label>
            <input
              className="input mt-1"
              type="number"
              step="0.1"
              value={form.sizeHa}
              onChange={(e) => setForm({ ...form, sizeHa: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Soil type</label>
            <select
              className="input mt-1"
              value={form.soilType}
              onChange={(e) => setForm({ ...form, soilType: e.target.value })}
            >
              <option value="clay">Clay</option>
              <option value="loam">Loam</option>
              <option value="sandy">Sandy</option>
              <option value="silt">Silt</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full h-10 disabled:opacity-70" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add farm
            </button>
          </div>
        </div>
      </form>

      <div className="surface overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted text-sm">Loading…</div>
        ) : !farms.length ? (
          <EmptyState
            icon={Tractor}
            title="No farms yet"
            description="Add your first farm above to start tracking conditions and getting recommendations."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Size (ha)</th>
                <th className="px-5 py-3 font-medium">Soil</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((f) => (
                <tr key={f._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-5 py-3 font-medium flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
                      <Tractor className="h-4 w-4" />
                    </div>
                    {f.name}
                  </td>
                  <td className="px-5 py-3">{f.sizeHa}</td>
                  <td className="px-5 py-3 capitalize">
                    <span className="badge bg-[var(--surface-2)] ring-1 ring-[var(--border)]">{f.soilType}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => del(f._id)}
                      className="btn-ghost text-rose-500 hover:!bg-rose-500/10 !px-2 !py-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
