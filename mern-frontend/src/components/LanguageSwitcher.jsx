import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (lng) => { i18n.changeLanguage(lng); localStorage.setItem('lang', lng); };
  return (
    <select
      value={i18n.language}
      onChange={(e) => change(e.target.value)}
      className="border rounded px-2 py-1 text-sm bg-white"
    >
      <option value="en">EN</option>
      <option value="rw">RW</option>
      <option value="fr">FR</option>
    </select>
  );
}
