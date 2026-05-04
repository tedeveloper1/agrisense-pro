import { createFileRoute } from "@tanstack/react-router";
import {
  Sprout, CloudSun, Cpu, Bell, Brain, Smartphone, BarChart3,
  CheckCircle2, ArrowRight, Leaf, Users, ShieldCheck, Languages,
} from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rwanda Beyond — Smart Farming Decision Support for Rwanda" },
      {
        name: "description",
        content:
          "Rwanda Beyond helps maize and vegetable farmers in Rwanda decide what, when and how to grow with IoT, weather, AI insights and expert advisories.",
      },
      { property: "og:title", content: "Rwanda Beyond — Smart Farming DSS" },
      {
        property: "og:description",
        content:
          "Real-time soil & weather intelligence, AI recommendations, and USSD access for smallholder farmers.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  { icon: Cpu, title: "Live IoT sensors", desc: "Soil moisture, temperature, humidity, rainfall — streamed in real time." },
  { icon: Brain, title: "AI recommendations", desc: "Crop, irrigation and pest advice tailored to your farm." },
  { icon: CloudSun, title: "Hyperlocal weather", desc: "Forecasts and alerts down to your district and crop stage." },
  { icon: Bell, title: "Smart alerts", desc: "Drought, pest pressure and harvest timing — never miss a window." },
  { icon: Smartphone, title: "USSD access", desc: "Works on any phone — no smartphone or internet required." },
  { icon: BarChart3, title: "Analytics for experts", desc: "District-level dashboards for agronomists and admins." },
];

const STEPS = [
  { num: "01", title: "Register your farm", desc: "Add your farm location, soil type and crops in minutes." },
  { num: "02", title: "Connect or simulate IoT", desc: "Pair sensors or use our simulator to see live data flowing." },
  { num: "03", title: "Get daily decisions", desc: "Receive personalised, expert-validated actions every day." },
];

const ROLES = [
  { icon: Leaf, title: "Farmers", desc: "Track farms, receive alerts, follow daily recommendations in EN / RW / FR.", color: "from-emerald-400/20 to-emerald-600/10" },
  { icon: Users, title: "Experts", desc: "Review AI recommendations, send advisories, monitor farm health.", color: "from-indigo-400/20 to-indigo-600/10" },
  { icon: ShieldCheck, title: "Admins", desc: "Manage users, devices, regions and platform-wide analytics.", color: "from-amber-400/20 to-amber-600/10" },
];

const STATS = [
  { value: "10k+", label: "Farms supported" },
  { value: "98%", label: "Alert accuracy" },
  { value: "3", label: "Languages" },
  { value: "24/7", label: "Sensor uptime" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3 py-1 text-xs text-muted-foreground animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Built for Rwandan farmers • EN · RW · FR
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in">
              Smart decisions for <br className="hidden sm:block" />
              <span className="text-gradient">every farm,</span> every day.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl animate-fade-in">
              Rwanda Beyond turns soil sensors, weather data and expert knowledge
              into clear daily actions for maize and vegetable farmers — on
              smartphone, web, or simple USSD.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in">
              <Button
                size="lg"
                className="bg-gradient-accent text-primary-foreground hover:opacity-90 shadow-glow group"
                asChild
              >
                <a href="/register">
                  Start free
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {[
                "No credit card",
                "USSD ready",
                "Expert validated",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero dashboard mockup */}
          <div className="relative mt-16 lg:mt-20 mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-accent rounded-2xl blur-2xl opacity-20" />
            <Card className="relative overflow-hidden rounded-2xl border-border shadow-elegant glass">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                <span className="ml-3 text-xs text-muted-foreground">app.rwandabeyond.rw / farmer / dashboard</span>
              </div>
              <CardContent className="p-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Soil moisture", value: "62%", trend: "+4%" },
                  { label: "Temperature", value: "24°C", trend: "stable" },
                  { label: "Humidity", value: "71%", trend: "+2%" },
                  { label: "Rain (24h)", value: "8 mm", trend: "—" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card/60 p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                    <div className="text-xs text-accent mt-1">{s.trend}</div>
                  </div>
                ))}
                <div className="md:col-span-4 rounded-xl border border-border bg-card/60 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Today's recommendation</span>
                    <span className="text-xs text-accent">AI · Expert verified</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Irrigate Plot B for 25 min before 10:00. Soil moisture trending below
                    optimal range for maize V6 stage; rainfall unlikely in next 48h.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-accent">Features</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Everything a modern farm needs.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From soil to harvest — one platform connects sensors, weather,
              AI and human expertise into clear, daily actions.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="group relative overflow-hidden border-border bg-card hover:shadow-elegant transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-accent/5 to-transparent" />
                <CardContent className="relative p-6">
                  <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-accent">How it works</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              From signup to harvest in three steps.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.num} className="relative rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition-all">
                <div className="text-5xl font-bold text-gradient">{s.num}</div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-accent">Roles</div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Built for everyone in the field.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <Card key={r.title} className="overflow-hidden border-border hover:shadow-elegant transition-all hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${r.color}`} />
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center">
                    <r.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Languages className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Available in your language</h3>
              <p className="text-sm text-muted-foreground">English, Kinyarwanda and Français — switch any time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {["English", "Kinyarwanda", "Français"].map((l) => (
              <span key={l} className="rounded-full border border-border bg-card px-3 py-1">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-primary p-10 md:p-14 text-primary-foreground shadow-elegant">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-chart-2/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to grow smarter?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl">
                Join thousands of farmers, experts and cooperatives already
                using Rwanda Beyond. Free to start, no credit card required.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow" asChild>
                  <a href="/register">Create free account</a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="/login">Sign in</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
