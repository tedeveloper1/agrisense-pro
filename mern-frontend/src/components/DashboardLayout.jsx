import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const NAV = {
  farmer: [
    ['/farmer/dashboard', 'nav.dashboard'],
    ['/farmer/farms', 'nav.farms'],
    ['/farmer/crops', 'nav.crops'],
    ['/farmer/iot-status', 'nav.iot'],
    ['/farmer/recommendations', 'nav.recommendations'],
    ['/farmer/alerts', 'nav.alerts'],
    ['/farmer/weather', 'nav.weather'],
    ['/farmer/history', 'nav.history'],
    ['/farmer/profile', 'nav.profile'],
  ],
  admin: [
    ['/admin/dashboard', 'nav.dashboard'],
    ['/admin/users', 'nav.users'],
    ['/admin/farmers', 'nav.farmers'],
    ['/admin/experts', 'nav.experts'],
    ['/admin/devices', 'nav.devices'],
    ['/admin/analytics', 'nav.analytics'],
    ['/admin/notifications', 'nav.notifications'],
    ['/admin/system-health', 'nav.systemHealth'],
    ['/admin/settings', 'nav.settings'],
  ],
  expert: [
    ['/expert/dashboard', 'nav.dashboard'],
    ['/expert/reviews', 'nav.reviews'],
    ['/expert/recommendations', 'nav.recommendations'],
    ['/expert/interventions', 'nav.interventions'],
    ['/expert/advisories', 'nav.advisories'],
    ['/expert/farm-data', 'nav.farmData'],
    ['/expert/profile', 'nav.profile'],
  ],
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const nav = useNavigate();
  const items = NAV[user?.role] || [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-brand-900 text-white p-4 flex flex-col">
        <div className="text-xl font-bold mb-6">🌱 {t('app.name')}</div>
        <nav className="flex-1 space-y-1">
          {items.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${isActive ? 'bg-brand-700' : 'hover:bg-brand-700/60'}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => { logout(); nav('/login'); }}
          className="mt-4 text-sm bg-red-600 hover:bg-red-700 rounded px-3 py-2"
        >
          {t('nav.logout')}
        </button>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm text-gray-600">{user?.name} · <span className="uppercase">{user?.role}</span></div>
          <LanguageSwitcher />
        </header>
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
