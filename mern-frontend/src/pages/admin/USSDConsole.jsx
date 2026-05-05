import { useEffect, useState } from 'react';
import { Phone, Send, Hash, Activity, Loader2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function USSDConsole() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulator state
  const [phone, setPhone] = useState('+250788000111');
  const [sessionId, setSessionId] = useState(`sim-${Date.now()}`);
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = () =>
    Promise.all([
      api.get('/admin/ussd/sessions'),
      api.get('/admin/ussd/stats'),
    ]).then(([a, b]) => {
      setSessions(a.data.sessions || []);
      setStats(b.data);
    }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const send = async (input) => {
    setBusy(true);
    const newText = text ? (input ? `${text}*${input}` : text) : input || '';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ussd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ sessionId, phoneNumber: phone, text: newText, serviceCode: '*123#' }),
      });
      const reply = await res.text();
      setTranscript((prev) => [...prev, { in: input || '(menu)', out: reply }]);
      setText(newText);
      if (reply.startsWith('END')) {
        setText('');
        setSessionId(`sim-${Date.now()}`);
      }
    } catch (e) {
      setTranscript((prev) => [...prev, { in: input, out: 'ERROR: ' + e.message }]);
    } finally { setBusy(false); load(); }
  };

  const reset = () => { setText(''); setTranscript([]); setSessionId(`sim-${Date.now()}`); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="USSD Console"
        description="Inspect live USSD sessions and simulate the *123# menu without a telco."
      />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface p-4">
            <div className="text-xs text-muted">Total sessions</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </div>
          <div className="surface p-4">
            <div className="text-xs text-muted">Last 24h</div>
            <div className="text-2xl font-bold mt-1">{stats.last24h}</div>
          </div>
          {(stats.byLang || []).map((l) => (
            <div key={l._id} className="surface p-4">
              <div className="text-xs text-muted uppercase">{l._id}</div>
              <div className="text-2xl font-bold mt-1">{l.count}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Simulator */}
        <div className="surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">USSD Simulator</h3>
                <p className="text-xs text-muted">Dial <b>*123#</b> from this phone.</p>
              </div>
            </div>
            <button onClick={reset} className="btn-ghost h-8 px-2 text-xs"><RefreshCw className="h-3.5 w-3.5" />Reset</button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted">Phone</label>
              <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">Session</label>
              <input className="input mt-1 font-mono text-xs" value={sessionId} readOnly />
            </div>
          </div>

          {/* Phone-style transcript */}
          <div className="mt-4 rounded-2xl bg-ink-950 text-ink-100 p-4 min-h-[260px] font-mono text-xs space-y-3 max-h-[320px] overflow-auto">
            {transcript.length === 0 ? (
              <div className="text-ink-400">Press <b>Dial</b> to start a session…</div>
            ) : transcript.map((t, i) => (
              <div key={i}>
                <div className="text-brand-400">› {t.in || '(initial)'}</div>
                <div className="text-ink-100 whitespace-pre-line">{t.out}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Reply (e.g. 1)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { send(e.target.value); e.target.value = ''; }
              }}
            />
            <button onClick={() => send('')} disabled={busy || transcript.length > 0} className="btn-primary h-10">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Dial
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['1','2','3','4','5','6','7','8','9','0','#','*'].map((k) => (
              <button key={k} onClick={() => send(k)} disabled={busy}
                className="h-9 w-9 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-sm font-medium">
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions list */}
        <div className="surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-brand-500" />
            <h3 className="font-semibold">Recent sessions</h3>
          </div>
          {loading ? (
            <div className="text-sm text-muted">Loading…</div>
          ) : sessions.length === 0 ? (
            <EmptyState icon={Hash} title="No USSD sessions yet" description="Sessions will appear here once farmers dial *123#." />
          ) : (
            <div className="overflow-auto max-h-[460px]">
              <table className="w-full text-xs">
                <thead className="text-muted">
                  <tr className="text-left">
                    <th className="py-2">Phone</th>
                    <th>Lang</th>
                    <th>Last input</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {sessions.map((s) => (
                    <tr key={s._id}>
                      <td className="py-2 font-mono">{s.phoneNumber}</td>
                      <td className="uppercase">{s.language}</td>
                      <td className="font-mono text-muted">{s.lastInput || '—'}</td>
                      <td className="text-muted whitespace-nowrap">{new Date(s.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
