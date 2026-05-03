import { Mail, Phone, Globe2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  const initials = (user.name || '?').split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account information." />

      <div className="surface p-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-accent grid place-items-center text-white text-xl font-semibold shadow-glow">
            {initials}
          </div>
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-400">{user.role}</span>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <Info icon={Mail} label="Email" value={user.email} />
          <Info icon={Phone} label="Phone" value={user.phone || '—'} />
          <Info icon={Globe2} label="Language" value={(user.language || 'en').toUpperCase()} />
          <Info icon={ShieldCheck} label="Status" value="Active" />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="surface-2 p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
