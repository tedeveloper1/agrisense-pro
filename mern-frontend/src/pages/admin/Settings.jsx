import { Settings as SettingsIcon, Globe, Bell, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const ITEMS = [
  { icon: Globe, title: 'Localization', desc: 'Default language, timezone and units.' },
  { icon: Bell, title: 'Notification rules', desc: 'Default channels, throttling and quiet hours.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Password policy, JWT lifetimes, rate limits.' },
  { icon: SettingsIcon, title: 'Integrations', desc: 'Weather APIs, SMS gateway, MQTT broker.' },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure system parameters and integrations." />

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((i) => (
          <div key={i.title} className="surface p-5 hover:shadow-elegant transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
                <i.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-xs text-muted">{i.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="surface p-5 text-sm text-muted">
        Detailed configuration UIs will appear here. (Placeholder)
      </div>
    </div>
  );
}
