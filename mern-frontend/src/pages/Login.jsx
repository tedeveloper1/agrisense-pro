import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await login(form.email, form.password); nav('/'); }
    catch { setErr(t('auth.invalid')); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <form onSubmit={submit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4 border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-700">🌱 {t('app.name')}</h1>
          <LanguageSwitcher />
        </div>
        <h2 className="text-lg font-semibold">{t('auth.login')}</h2>
        {err && <div className="bg-red-50 text-red-700 text-sm rounded p-2">{err}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.email')} type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.password')} type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button disabled={busy} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded font-medium">
          {busy ? '...' : t('auth.submit')}
        </button>
        <Link to="/register" className="block text-sm text-center text-brand-700 hover:underline">{t('auth.noAccount')}</Link>
        <p className="text-xs text-gray-500 text-center">Demo: admin@demo.rw / farmer@demo.rw / expert@demo.rw — password123</p>
      </form>
    </div>
  );
}
