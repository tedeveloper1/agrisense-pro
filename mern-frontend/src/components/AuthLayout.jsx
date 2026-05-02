import { Sprout, CheckCircle2 } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-ink-950 text-ink-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-white">AgriPulse</span>
          </div>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Smart decisions for <span className="bg-gradient-accent bg-clip-text text-transparent">every farm.</span>
          </h2>
          <p className="mt-3 text-ink-300">
            IoT sensors, hyperlocal weather, AI insights and expert advisories — built for
            maize and vegetable farmers in Rwanda and East Africa.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-200">
            {['Live soil & weather monitoring', 'Daily AI recommendations', 'USSD access for any phone'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-ink-400">© {new Date().getFullYear()} AgriPulse</div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-col">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex-1 grid place-items-center p-6 sm:p-10">
          <div className="w-full max-w-md animate-fade-in">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">AgriPulse</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 text-sm text-muted text-center">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
