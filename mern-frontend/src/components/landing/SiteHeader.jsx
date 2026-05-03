import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sprout, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';

const LINKS = [
  { to: '/#features', label: 'Features' },
  { to: '/#how', label: 'How it works' },
  { to: '/#roles', label: 'Roles' },
  { to: '/#pricing', label: 'Pricing' },
];

export default function SiteHeader() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? 'backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight">AgriPulse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="px-3 py-2 text-sm text-muted hover:text-[var(--text)] transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <ThemeToggle />
          {user ? (
            <NavLink to="/app" className="btn-primary h-9 !px-4">
              Open app
            </NavLink>
          ) : (
            <>
              <Link to="/login" className="btn-ghost h-9 hidden sm:inline-flex">Sign in</Link>
              <Link to="/register" className="btn-primary h-9 !px-4">Get started</Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden btn-ghost h-9 w-9 p-0 grid place-items-center"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
          <div className="px-4 py-3 flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-muted hover:text-[var(--text)]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
