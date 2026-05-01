import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'farmer', language: 'en' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await register(form); nav('/'); }
    catch (ex) { setErr(ex?.response?.data?.message || 'Error'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <form onSubmit={submit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-3 border">
        <h1 className="text-xl font-bold text-brand-700">{t('auth.register')}</h1>
        {err && <div className="bg-red-50 text-red-700 text-sm rounded p-2">{err}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.name')} value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.email')} type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.password')} type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required minLength={6} />
        <input className="w-full border rounded px-3 py-2" placeholder={t('auth.phone')} value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
        <select className="w-full border rounded px-3 py-2" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="farmer">Farmer</option>
          <option value="expert">Expert</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={form.language} onChange={(e)=>setForm({...form,language:e.target.value})}>
          <option value="en">English</option><option value="rw">Kinyarwanda</option><option value="fr">Francais</option>
        </select>
        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded">{t('auth.submit')}</button>
        <Link to="/login" className="block text-sm text-center text-brand-700 hover:underline">{t('auth.hasAccount')}</Link>
      </form>
    </div>
  );
}
