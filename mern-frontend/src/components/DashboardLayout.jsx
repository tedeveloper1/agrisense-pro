import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout, LayoutDashboard, Tractor, Wheat, Cpu, Lightbulb, Bell, CloudSun,
  History, User, Users, UserCheck, Activity, Settings, Server, BarChart3,
  ClipboardCheck, MessagesSquare, Stethoscope, Database, Search, LogOut, Menu, X,
  ShieldCheck, Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const NAV = {
  farmer: [
    { group: 'Overview', items: [
      { to: '/farmer/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
    ]},
    { group: 'Farming', items: [
      { to: '/farmer/farms', key: 'nav.farms', icon: Tractor },
      { to: '/farmer/crops', key: 'nav.crops', icon: Wheat },
      { to: '/farmer/iot-status', key: 'nav.iot', icon: Cpu },
    ]},
    { group: 'Insights', items: [
      { to: '/farmer/recommendations', key: 'nav.recommendations', icon: Lightbulb },
      { to: '/farmer/protection', key: 'nav.protection', icon: ShieldCheck },
      { to: '/farmer/disease', key: 'nav.disease', icon: Stethoscope },
      { to: '/farmer/alerts', key: 'nav.alerts', icon: Bell },
      { to: '/farmer/weather', key: 'nav.weather', icon: CloudSun },
      { to: '/farmer/history', key: 'nav.history', icon: History },
    ]},
    { group: 'Account', items: [
      { to: '/farmer/ussd', key: 'nav.ussd', icon: Phone },
      { to: '/farmer/profile', key: 'nav.profile', icon: User },
    ]},
    { group: 'Account', items: [
      { to: '/farmer/profile', key: 'nav.profile', icon: User },
    ]},
  ],
  admin: [
    { group: 'Overview', items: [
      { to: '/admin/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', key: 'nav.analytics', icon: BarChart3 },
    ]},
    { group: 'People', items: [
      { to: '/admin/users', key: 'nav.users', icon: Users },
      { to: '/admin/farmers', key: 'nav.farmers', icon: Tractor },
      { to: '/admin/experts', key: 'nav.experts', icon: UserCheck },
    ]},
    { group: 'Platform', items: [
      { to: '/admin/devices', key: 'nav.devices', icon: Cpu },
      { to: '/admin/notifications', key: 'nav.notifications', icon: Bell },
      { to: '/admin/system-health', key: 'nav.systemHealth', icon: Server },
      { to: '/admin/settings', key: 'nav.settings', icon: Settings },
    ]},
  ],
  expert: [
    { group: 'Overview', items: [
      { to: '/expert/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
    ]},
    { group: 'Work', items: [
      { to: '/expert/reviews', key: 'nav.reviews', icon: ClipboardCheck },
      { to: '/expert/recommendations', key: 'nav.recommendations', icon: Lightbulb },
      { to: '/expert/interventions', key: 'nav.interventions', icon: Stethoscope },
      { to: '/expert/advisories', key: 'nav.advisories', icon: MessagesSquare },
    ]},
    { group: 'Data', items: [
      { to: '/expert/farm-data', key: 'nav.farmData', icon: Database },
      { to: '/expert/profile', key: 'nav.profile', icon: User },
    ]},
  ],
};

const ROLE_BADGE = {
  farmer: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20',
  admin: 'bg-indigo-500/15 text-indigo-500 ring-1 ring-indigo-500/20',
  expert: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20',
};

function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const groups = NAV[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 shrink-0 border-r border-[var(--border)]
          bg-ink-950 text-ink-100 flex flex-col transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Rwanda Beyond</div>
              <div className="text-[10px] uppercase text-ink-400 tracking-wider">{t('app.name')}</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-300 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map((g) => (
            <div key={g.group}>
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1.5">
                {g.group}
              </div>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group relative
                       ${isActive
                         ? 'bg-white/5 text-white'
                         : 'text-ink-300 hover:bg-white/5 hover:text-white'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-brand-500" />
                        )}
                        <it.icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-ink-400 group-hover:text-ink-200'}`} />
                        <span>{t(it.key)}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="surface-2 !bg-white/5 !border-white/5 p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-accent grid place-items-center text-white text-sm font-semibold">
              {(user?.name || '?').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate text-white">{user?.name}</div>
              <div className="text-[11px] text-ink-400 truncate">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function getCrumb(pathname) {
  const segs = pathname.split('/').filter(Boolean);
  return segs.map((s, i) => ({
    label: s.replace(/-/g, ' '),
    href: '/' + segs.slice(0, i + 1).join('/'),
  }));
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const crumbs = getCrumb(loc.pathname);

  return (
    <div className="min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 backdrop-blur bg-[var(--bg)]/80 border-b border-[var(--border)]">
          <div className="h-full px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden btn-ghost rounded-lg h-9 w-9 p-0 grid place-items-center"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav className="hidden md:flex items-center text-xs text-muted gap-1.5 truncate">
                {crumbs.map((c, i) => (
                  <span key={c.href} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-muted/60">/</span>}
                    <span className={i === crumbs.length - 1 ? 'text-[var(--text)] capitalize font-medium' : 'capitalize'}>
                      {c.label}
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  className="input !pl-9"
                  placeholder={t('common.search') + '…'}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <span className={`badge hidden sm:inline-flex ${ROLE_BADGE[user?.role] || ''}`}>
                {user?.role}
              </span>
              <button
                onClick={() => { logout(); nav('/login'); }}
                className="btn-ghost rounded-lg h-9 px-3"
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
