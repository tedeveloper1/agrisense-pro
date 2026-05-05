import { useState } from 'react';
import { Phone, Languages, CloudSun, Lightbulb, ShieldCheck, Hash } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const MENU = {
  en: {
    code: '*123#',
    title: 'Dial from any phone — no internet required',
    intro: 'Rwanda Beyond works on basic phones too. Dial the short code below to check weather, recommendations and protection alerts in your language.',
    items: [
      { k: '1', label: 'Weather forecast for your district' },
      { k: '2', label: 'Today’s farming recommendations' },
      { k: '3', label: 'Change language (EN / RW / FR)' },
    ],
  },
  rw: {
    code: '*123#',
    title: 'Kanda kuri telefoni iyo ari yo yose — nta interineti ikenewe',
    intro: 'Rwanda Beyond ikora no kuri telefoni zisanzwe. Kanda code ikurikira kugira ngo umenye iteganyagihe, inama n’ibyitabwaho mu rurimi rwawe.',
    items: [
      { k: '1', label: 'Iteganyagihe ry’akarere kawe' },
      { k: '2', label: 'Inama z’uyu munsi mu buhinzi' },
      { k: '3', label: 'Hindura ururimi (EN / RW / FR)' },
    ],
  },
  fr: {
    code: '*123#',
    title: 'Composez depuis n’importe quel téléphone — sans internet',
    intro: 'Rwanda Beyond fonctionne aussi sur les téléphones basiques. Composez le code court ci-dessous pour la météo, les recommandations et les alertes de protection.',
    items: [
      { k: '1', label: 'Météo de votre district' },
      { k: '2', label: 'Recommandations agricoles du jour' },
      { k: '3', label: 'Changer de langue (EN / RW / FR)' },
    ],
  },
};

export default function USSDInfo() {
  const [lang, setLang] = useState('en');
  const m = MENU[lang];

  return (
    <div className="space-y-6">
      <PageHeader
        title="USSD access"
        description="Use Rwanda Beyond on a basic phone — no smartphone or data needed."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Phone mockup */}
        <div className="surface p-6 lg:col-span-1">
          <div className="mx-auto w-56 rounded-[28px] border-4 border-ink-900 bg-ink-950 text-ink-100 p-4 shadow-xl">
            <div className="text-[10px] text-ink-400 text-center">Rwanda Beyond USSD</div>
            <div className="mt-3 text-center">
              <div className="text-3xl font-bold tracking-widest">{m.code}</div>
              <div className="text-[11px] text-ink-400 mt-1">Press the call button</div>
            </div>
            <div className="mt-4 rounded-lg bg-black/40 p-3 text-[11px] font-mono leading-relaxed">
              <div>1. {lang === 'rw' ? 'Iteganyagihe' : lang === 'fr' ? 'Météo' : 'Weather'}</div>
              <div>2. {lang === 'rw' ? 'Inama' : lang === 'fr' ? 'Conseils' : 'Recommendations'}</div>
              <div>3. {lang === 'rw' ? 'Hindura ururimi' : lang === 'fr' ? 'Langue' : 'Language'}</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {['1','2','3','4','5','6','7','8','9','*','0','#'].map((k) => (
                <div key={k} className="h-7 rounded grid place-items-center bg-white/5 text-xs">{k}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Guide */}
        <div className="lg:col-span-2 space-y-4">
          <div className="surface p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-xs text-muted">{m.intro}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-2)] p-1">
                {['en','rw','fr'].map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`h-7 px-2.5 text-xs rounded-md uppercase ${lang === l ? 'bg-brand-500 text-white' : 'text-muted'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <ul className="mt-4 divide-y divide-[var(--border)]">
              {m.items.map((it) => (
                <li key={it.k} className="py-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center font-bold">
                    {it.k}
                  </div>
                  <span className="text-sm">{it.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { i: CloudSun, t: 'Live weather', d: 'Per-district temperature, rain & humidity.' },
              { i: Lightbulb, t: 'Daily advice', d: 'Personalised crop guidance based on your farm.' },
              { i: ShieldCheck, t: 'Protection alerts', d: 'Get warned about frost, blight & pests.' },
            ].map((c, i) => (
              <div key={i} className="surface p-4">
                <c.i className="h-5 w-5 text-brand-500" />
                <div className="mt-2 font-semibold text-sm">{c.t}</div>
                <div className="text-xs text-muted mt-0.5">{c.d}</div>
              </div>
            ))}
          </div>

          <div className="surface p-4 flex items-start gap-3 text-xs text-muted">
            <Hash className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              The short code <b className="text-[var(--text)]">*123#</b> is a placeholder. In production it is provisioned with a telco
              (e.g. MTN / Airtel) and routes via Africa’s Talking to <code className="font-mono">/api/ussd</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
