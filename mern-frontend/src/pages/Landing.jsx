import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CloudSun, Cpu, Bell, Brain, Smartphone, BarChart3,
  CheckCircle2, ArrowRight, Leaf, Users, ShieldCheck, Languages, Stethoscope,
} from 'lucide-react';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';

export default function Landing() {
  const { t, i18n } = useTranslation();

  const COPY = {
    en: {
      pill: 'Built for Rwandan farmers • EN · RW · FR',
      h1a: 'Smart decisions for', h1b: 'every farm,', h1c: 'every day.',
      sub: 'Rwanda Beyond turns soil sensors, weather data and expert knowledge into clear daily actions for maize and vegetable farmers — on smartphone, web, or simple USSD.',
      start: 'Start free', how: 'See how it works',
      proof: ['No credit card', 'USSD ready', 'Expert validated'],
      featTitle: 'Everything a modern farm needs.',
      featSub: 'From soil to harvest — one platform connects sensors, weather, AI and human expertise into clear, daily actions.',
      stepTitle: 'From signup to harvest in three steps.',
      roleTitle: 'Built for everyone in the field.',
      langTitle: 'Available in your language',
      langSub: 'English, Kinyarwanda and Français — switch any time.',
      ctaTitle: 'Ready to grow smarter?',
      ctaSub: 'Join thousands of farmers, experts and cooperatives already using Rwanda Beyond. Free to start, no credit card required.',
      ctaCreate: 'Create free account', ctaSign: 'Sign in',
    },
    rw: {
      pill: 'Yakorewe abahinzi b\'u Rwanda • EN · RW · FR',
      h1a: 'Ibyemezo bishyize mu gaciro ku', h1b: 'mirima yose,', h1c: 'buri munsi.',
      sub: 'Rwanda Beyond ihuza sensor z\'ubutaka, amakuru y\'iteganyagihe n\'ubumenyi bw\'impuguke kugira ngo abahinzi babone ibikorwa byumvikana buri munsi — kuri telefoni igezweho, urubuga, cyangwa USSD.',
      start: 'Tangira ku buntu', how: 'Reba uko bikora',
      proof: ['Nta karita y\'amabanki', 'USSD irahari', 'Yemejwe n\'impuguke'],
      featTitle: 'Ibyo umurima ugezweho ukeneye byose.',
      featSub: 'Kuva ku butaka kugeza ku isarura — urubuga rumwe ruhuza sensor, iteganyagihe, AI n\'ubumenyi bwa muntu.',
      stepTitle: 'Kuva mu kwiyandikisha kugeza ku isarura mu ntambwe 3.',
      roleTitle: 'Yakozwe ku bantu bose bo mu murima.',
      langTitle: 'Iboneka mu rurimi rwawe',
      langSub: 'Icyongereza, Ikinyarwanda na Français — uhinduke igihe icyo aricyo cyose.',
      ctaTitle: 'Witeguye guhinga ushyize mu gaciro?',
      ctaSub: 'Iyandikishe nk\'ibihumbi by\'abahinzi, impuguke n\'amakoperative bakoresha Rwanda Beyond. Ni ubuntu.',
      ctaCreate: 'Iyandikishe ku buntu', ctaSign: 'Injira',
    },
    fr: {
      pill: 'Pense pour les agriculteurs rwandais • EN · RW · FR',
      h1a: 'Decisions intelligentes pour', h1b: 'chaque ferme,', h1c: 'chaque jour.',
      sub: 'Rwanda Beyond transforme capteurs de sol, donnees meteo et savoir d\'expert en actions quotidiennes claires pour les agriculteurs — sur smartphone, web ou simple USSD.',
      start: 'Commencer', how: 'Voir comment ca marche',
      proof: ['Sans carte bancaire', 'USSD pret', 'Valide par des experts'],
      featTitle: 'Tout ce qu\'une ferme moderne demande.',
      featSub: 'Du sol a la recolte — une seule plateforme reliant capteurs, meteo, IA et expertise humaine.',
      stepTitle: 'De l\'inscription a la recolte en trois etapes.',
      roleTitle: 'Pour tous les acteurs du terrain.',
      langTitle: 'Disponible dans votre langue',
      langSub: 'Anglais, Kinyarwanda et Français — changez a tout moment.',
      ctaTitle: 'Pret a cultiver plus intelligemment ?',
      ctaSub: 'Rejoignez des milliers d\'agriculteurs, experts et cooperatives. Gratuit, sans carte bancaire.',
      ctaCreate: 'Creer un compte gratuit', ctaSign: 'Se connecter',
    },
  };
  const c = COPY[i18n.language] || COPY.en;

  const FEATURES = [
    { icon: Cpu, t: { en: 'Live IoT sensors', rw: 'Sensor zikora ako kanya', fr: 'Capteurs IoT en direct' },
      d: { en: 'Soil moisture, temperature, humidity, rainfall, pH — streamed in real time.',
           rw: 'Ubushuhe, ubushyuhe, imvura, pH y\'ubutaka — bigaragara ako kanya.',
           fr: 'Humidite, temperature, pluie, pH — en temps reel.' } },
    { icon: Brain, t: { en: 'AI recommendations', rw: 'Inama za AI', fr: 'Recommandations IA' },
      d: { en: 'Crop, irrigation and pest advice tailored to your farm.',
           rw: 'Inama z\'ihinga, kuhira no kurwanya udukoko zigenwe ku murima wawe.',
           fr: 'Conseils cultures, irrigation, ravageurs adaptes a votre ferme.' } },
    { icon: Stethoscope, t: { en: 'Disease prediction', rw: 'Iteganya indwara', fr: 'Prediction des maladies' },
      d: { en: 'Detect maize & vegetable diseases early from symptoms or photos.',
           rw: 'Menya hakiri kare indwara z\'ibigori n\'imboga.',
           fr: 'Detectez tot les maladies du mais et des legumes.' } },
    { icon: CloudSun, t: { en: 'Hyperlocal weather', rw: 'Iteganyagihe ry\'akarere', fr: 'Meteo hyperlocale' },
      d: { en: 'Forecasts and alerts down to your district and crop stage.',
           rw: 'Iteganya n\'iburira ku rwego rw\'akarere n\'igihe cy\'igihingwa.',
           fr: 'Previsions et alertes au niveau du district.' } },
    { icon: Bell, t: { en: 'Smart alerts', rw: 'Iburira ryihuse', fr: 'Alertes intelligentes' },
      d: { en: 'Drought, pest pressure and harvest timing — never miss a window.',
           rw: 'Amapfa, udukoko n\'isaha y\'isarura — ntiwabura igihe cyiza.',
           fr: 'Secheresse, ravageurs, periode de recolte — ne ratez rien.' } },
    { icon: Smartphone, t: { en: 'USSD access', rw: 'USSD', fr: 'Acces USSD' },
      d: { en: 'Works on any phone — no smartphone or internet required.',
           rw: 'Ikora kuri telefoni iyo ari yo yose — nta interineti.',
           fr: 'Fonctionne sur tout telephone — sans internet.' } },
  ];

  const STEPS = [
    { num: '01', t: { en: 'Register your farm', rw: 'Iyandikishe umurima', fr: 'Inscrivez votre ferme' },
      d: { en: 'Add your farm location, soil type and crops in minutes.',
           rw: 'Ongeraho aho umurima uherereye, ubwoko bw\'ubutaka n\'ibihingwa.',
           fr: 'Ajoutez l\'emplacement, le sol et les cultures en quelques minutes.' } },
    { num: '02', t: { en: 'Connect or simulate IoT', rw: 'Huza cyangwa ukoreshe simulator', fr: 'Connectez ou simulez l\'IoT' },
      d: { en: 'Pair sensors or use our simulator to see live data flowing.',
           rw: 'Huza sensor cyangwa ukoreshe simulator ubone amakuru.',
           fr: 'Connectez les capteurs ou utilisez le simulateur.' } },
    { num: '03', t: { en: 'Get daily decisions', rw: 'Akira ibyemezo bya buri munsi', fr: 'Recevez des decisions quotidiennes' },
      d: { en: 'Receive personalised, expert-validated actions every day.',
           rw: 'Akira ibikorwa byihariye, byemejwe n\'impuguke buri munsi.',
           fr: 'Recevez des actions personnalisees validees chaque jour.' } },
  ];

  const ROLES = [
    { icon: Leaf, t: { en: 'Farmers', rw: 'Abahinzi', fr: 'Agriculteurs' },
      d: { en: 'Track farms, receive alerts, follow daily recommendations in EN / RW / FR.',
           rw: 'Kurikirana imirima, akira iburira, kurikiza inama mu rurimi rwawe.',
           fr: 'Suivez fermes, alertes et recommandations en EN / RW / FR.' } },
    { icon: Users, t: { en: 'Experts', rw: 'Impuguke', fr: 'Experts' },
      d: { en: 'Review AI recommendations, send advisories, monitor farm health.',
           rw: 'Suzuma inama za AI, ohereza inama, kurikirana ubuzima bw\'imirima.',
           fr: 'Validez les recommandations IA, envoyez des avis, surveillez les fermes.' } },
    { icon: ShieldCheck, t: { en: 'Admins', rw: 'Abayobozi', fr: 'Administrateurs' },
      d: { en: 'Manage users, devices, regions and platform-wide analytics.',
           rw: 'Yobora abakoresha, ibikoresho n\'isesengura ry\'urubuga.',
           fr: 'Gerez utilisateurs, appareils, regions et analyses.' } },
  ];

  const STATS = [
    { value: '10k+', label: { en: 'Farms supported', rw: 'Imirima ifashwa', fr: 'Fermes soutenues' } },
    { value: '98%', label: { en: 'Alert accuracy', rw: 'Ukuri kw\'iburira', fr: 'Precision des alertes' } },
    { value: '3', label: { en: 'Languages', rw: 'Indimi', fr: 'Langues' } },
    { value: '24/7', label: { en: 'Sensor uptime', rw: 'Sensor zikora', fr: 'Disponibilite capteurs' } },
  ];

  const lng = i18n.language in COPY ? i18n.language : 'en';

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden pt-32 pb-24 bg-gradient-hero">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur px-3 py-1 text-xs text-muted animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              {c.pill}
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in">
              {c.h1a} <br className="hidden sm:block" />
              <span className="bg-gradient-accent bg-clip-text text-transparent">{c.h1b}</span> {c.h1c}
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl animate-fade-in">{c.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in">
              <Link to="/register" className="btn-primary h-12 !px-6 group">
                {c.start}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#how" className="btn-outline h-12 !px-6">{c.how}</a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
              {c.proof.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" />{p}
                </div>
              ))}
            </div>
          </div>

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
                  { label: t('dashboard.soilMoisture'), value: '62%', trend: '+4%' },
                  { label: t('dashboard.temperature'), value: '24°C', trend: 'stable' },
                  { label: t('dashboard.humidity'), value: '71%', trend: '+2%' },
                  { label: t('dashboard.ph'), value: '6.4', trend: 'optimal' },
                ].map((s) => (
                  <div key={s.label} className="surface-2 p-4">
                    <div className="text-xs uppercase tracking-wide text-muted">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                    <div className="text-xs text-brand-600 dark:text-brand-400 mt-1">{s.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-muted mt-1">{s.label[lng]}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400">Features</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">{c.featTitle}</h2>
            <p className="mt-4 text-muted">{c.featSub}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.t.en} className="surface p-6 hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 font-semibold">{f.t[lng]}</h3>
                <p className="mt-2 text-sm text-muted">{f.d[lng]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-24 border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">{c.stepTitle}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="surface p-6 hover:shadow-elegant transition-all">
                <div className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">{s.num}</div>
                <h3 className="mt-4 font-semibold">{s.t[lng]}</h3>
                <p className="mt-2 text-sm text-muted">{s.d[lng]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">{c.roleTitle}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.t.en} className="surface p-6 hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className="h-11 w-11 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{r.t[lng]}</h3>
                <p className="mt-2 text-sm text-muted">{r.d[lng]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Languages className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{c.langTitle}</h3>
              <p className="text-sm text-muted">{c.langSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {['English', 'Kinyarwanda', 'Français'].map((l) => (
              <span key={l} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">{l}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-primary p-10 md:p-14 text-white shadow-elegant">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{c.ctaTitle}</h2>
              <p className="mt-4 text-lg text-white/80 max-w-xl">{c.ctaSub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn h-12 !px-6 bg-brand-500 hover:bg-brand-600 text-white shadow-glow">
                  {c.ctaCreate}
                </Link>
                <Link to="/login" className="btn h-12 !px-6 border border-white/20 text-white hover:bg-white/10">
                  {c.ctaSign}
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
