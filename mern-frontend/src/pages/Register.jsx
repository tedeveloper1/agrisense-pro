import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'farmer', language: 'en' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await register(form); nav('/'); }
    catch (ex) { setErr(ex?.response?.data?.message || 'Error'); }
    finally { setBusy(false); }
  };

  return (
    <AuthLayout
      title={t('auth.register')}
      subtitle="Create your free account in under a minute."
      footer={<Link to="/login" className="text-brand-600 hover:underline">{t('auth.hasAccount')}</Link>}
    >
      <form onSubmit={submit} className="space-y-4">
        {err && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-sm px-3 py-2 animate-fade-in">
            <AlertCircle className="h-4 w-4" /> {err}
          </div>
        )}

        <Field icon={User} label={t('auth.name')}>
          <input className="input !pl-9" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        </Field>
        <Field icon={Mail} label={t('auth.email')}>
          <input className="input !pl-9" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        </Field>
        <Field icon={Lock} label={t('auth.password')}>
          <input className="input !pl-9" type="password" minLength={6} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        </Field>
        <Field icon={Phone} label={t('auth.phone')}>
          <input className="input !pl-9" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted">{t('auth.role')}</label>
            <select className="input mt-1" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
              <option value="farmer">Farmer</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">{t('auth.language')}</label>
            <select className="input mt-1" value={form.language} onChange={(e)=>setForm({...form,language:e.target.value})}>
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full h-11 disabled:opacity-70">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? t('common.loading') : t('auth.submit')}
        </button>
      </form>
    </AuthLayout>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted">{label}</label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted z-10" />
        {children}
      </div>
    </div>
  );
}
