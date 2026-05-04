import { Link } from 'react-router-dom';
import {
  CloudSun, Cpu, Bell, Brain, Smartphone, BarChart3,
  CheckCircle2, ArrowRight, Leaf, Users, ShieldCheck, Languages, Stethoscope,
} from 'lucide-react';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';

const FEATURES = [
  { icon: Cpu, title: 'Live IoT sensors', desc: 'Soil moisture, temperature, humidity, rainfall — streamed in real time.' },
  { icon: Brain, title: 'AI recommendations', desc: 'Crop, irrigation and pest advice tailored to your farm.' },
  { icon: Stethoscope, title: 'Disease prediction', desc: 'Detect maize & vegetable diseases early from symptoms or photos.' },
  { icon: CloudSun, title: 'Hyperlocal weather', desc: 'Forecasts and alerts down to your district and crop stage.' },
  { icon: Bell, title: 'Smart alerts', desc: 'Drought, pest pressure and harvest timing — never miss a window.' },
  { icon: Smartphone, title: 'USSD access', desc: 'Works on any phone — no smartphone or internet required.' },
];

const STEPS = [
  { num: '01', title: 'Register your farm', desc: 'Add your farm location, soil type and crops in minutes.' },
  { num: '02', title: 'Connect or simulate IoT', desc: 'Pair sensors or use our simulator to see live data flowing.' },
  { num: '03', title: 'Get daily decisions', desc: 'Receive personalised, expert-validated actions every day.' },
];

const ROLES = [
  { icon: Leaf, title: 'Farmers', desc: 'Track farms, receive alerts, follow daily recommendations in EN / RW / FR.' },
  { icon: Users, title: 'Experts', desc: 'Review AI recommendations, send advisories, monitor farm health.' },
  { icon: ShieldCheck, title: 'Admins', desc: 'Manage users, devices, regions and platform-wide analytics.' },
];

const STATS = [
  { value: '10k+', label: 'Farms supported' },
  { value: '98%', label: 'Alert accuracy' },
  { value: '3', label: 'Languages' },
  { value: '24/7', label: 'Sensor uptime' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 bg-gradient-hero">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur px-3 py-1 text-xs text-muted animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              Built for Rwandan farmers • EN · RW · FR
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in">
              Smart decisions for <br className="hidden sm:block" />
              <span className="bg-gradient-accent bg-clip-text text-transparent">every farm,</span> every day.
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl animate-fade-in">
              Rwanda Beyond turns soil sensors, weather data and expert knowledge into clear daily
              actions for maize and vegetable farmers — on smartphone, web, or simple USSD.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in">
              <Link to="/register" className="btn-primary h-12 !px-6 group">
                Start free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#how" className="btn-outline h-12 !px-6">See how it works</a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
              {['No credit card', 'USSD ready', 'Expert validated'].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero dashboard mockup */}
          <div className="relative mt-16 lg:mt-20 mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-accent rounded-2xl blur-2xl opacity-20" />
            <div className="surface relative overflow-hidden rounded-2xl shadow-elegant">
              <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500/70" />
                <span className="ml-3 text-xs text-muted">app.rwandabeyond.rw / farmer / dashboard</span>
              </div>
              <div className="p-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: 'Soil moisture', value: '62%', trend: '+4%' },
                  { label: 'Temperature', value: '24°C', trend: 'stable' },
                  { label: 'Humidity', value: '71%', trend: '+2%' },
                  { label: 'Rain (24h)', value: '8 mm', trend: '—' },
                ].map((s) => (
                  <div key={s.label} className="surface-2 p-4">
                    <div className="text-xs uppercase tracking-wide text-muted">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                    <div className="text-xs text-brand-600 dark:text-brand-400 mt-1">{s.trend}</div>
                  </div>
                ))}
                <div className="md:col-span-4 surface-2 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Today's recommendation</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400">AI · Expert verified</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Irrigate Plot B for 25 min before 10:00. Soil moisture trending below
                    optimal range for maize V6 stage; rainfall unlikely in next 48h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400">Features</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Everything a modern farm needs.
            </h2>
            <p className="mt-4 text-muted">
              From soil to harvest — one platform connects sensors, weather, AI and human
              expertise into clear, daily actions.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface p-6 hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-24 border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400">How it works</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              From signup to harvest in three steps.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="surface p-6 hover:shadow-elegant transition-all">
                <div className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">{s.num}</div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400">Roles</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Built for everyone in the field.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="surface p-6 hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="h-11 w-11 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Available in your language</h3>
              <p className="text-sm text-muted">English, Kinyarwanda and Français — switch any time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {['English', 'Kinyarwanda', 'Français'].map((l) => (
              <span key={l} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-primary p-10 md:p-14 text-white shadow-elegant">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to grow smarter?
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-xl">
                Join thousands of farmers, experts and cooperatives already using Rwanda Beyond.
                Free to start, no credit card required.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn h-12 !px-6 bg-brand-500 hover:bg-brand-600 text-white shadow-glow">
                  Create free account
                </Link>
                <Link to="/login" className="btn h-12 !px-6 border border-white/20 text-white hover:bg-white/10">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
