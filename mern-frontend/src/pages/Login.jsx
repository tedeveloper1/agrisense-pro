import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await login(form.email, form.password); nav('/'); }
    catch { setErr(t('auth.invalid')); }
    finally { setBusy(false); }
  };

  const fill = (email) => setForm({ email, password: 'password123' });

  return (
    <AuthLayout
      title={t('auth.login')}
      subtitle="Welcome back. Sign in to your dashboard."
      footer={<Link to="/register" className="text-brand-600 hover:underline">{t('auth.noAccount')}</Link>}
    >
      <form onSubmit={submit} className="space-y-4">
        {err && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-sm px-3 py-2 animate-fade-in">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-muted">{t('auth.email')}</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              className="input !pl-9"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@farm.rw"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t('auth.password')}</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              className="input !pl-9 !pr-9"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--text)] p-1"
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full h-11 disabled:opacity-70">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? t('common.loading') : t('auth.submit')}
        </button>

        <div className="surface-2 p-3 text-xs">
          <div className="font-medium mb-2 text-muted">Demo accounts (password: <code className="px-1 rounded bg-black/10 dark:bg-white/10">password123</code>)</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              ['Admin', 'admin@demo.rw'],
              ['Farmer', 'farmer@demo.rw'],
              ['Expert', 'expert@demo.rw'],
            ].map(([role, email]) => (
              <button
                key={email}
                type="button"
                onClick={() => fill(email)}
                className="btn-outline !py-1.5 !px-2 text-xs justify-center"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
