import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'rw', label: 'RW' },
  { code: 'fr', label: 'FR' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (lng) => { i18n.changeLanguage(lng); localStorage.setItem('lang', lng); };
  return (
    <div className="surface-2 inline-flex items-center gap-1 p-1 rounded-full text-xs">
      <Globe className="h-3.5 w-3.5 ml-2 text-muted" />
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          className={`px-2.5 py-1 rounded-full transition ${
            i18n.language === l.code
              ? 'bg-brand-600 text-white shadow-glow'
              : 'text-muted hover:text-[var(--text)]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
