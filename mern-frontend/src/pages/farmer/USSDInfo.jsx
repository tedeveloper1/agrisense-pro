import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, CloudSun, Lightbulb, ShieldCheck, Hash, Stethoscope, FlaskConical } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export default function USSDInfo() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');
  const code = '*123#';
  const items = [
    { k: '1', label: t('ussd.menu1') },
    { k: '2', label: t('ussd.menu2') },
    { k: '3', label: t('ussd.menu3') },
    { k: '4', label: t('ussd.menu4') },
    { k: '5', label: t('ussd.menu5') },
    { k: '6', label: t('ussd.menu6') },
    { k: '7', label: t('ussd.menu7') },
  ];
  const m = { code, title: t('ussd.dialPrompt'), intro: t('ussd.dialIntro'), items };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('ussd.title')}
        description={t('ussd.description')}
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
              <div>1. {t('ussd.menu1')}</div>
              <div>2. {t('ussd.menu2')}</div>
              <div>3. {t('ussd.menu3')}</div>
              <div>4. {t('ussd.menu4')}</div>
              <div>5. {t('ussd.menu5')}</div>
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
                  <button key={l} onClick={() => { setLang(l); i18n.changeLanguage(l); localStorage.setItem('lang', l); }}
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
            <div>{t('ussd.telcoNote')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
