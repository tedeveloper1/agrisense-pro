import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sprout, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Roles", href: "#roles" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow group-hover:scale-105 transition-transform">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">AgriPulse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-muted-foreground hover:text-foreground transition-colors story-link"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <a href="/login">Sign in</a>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-accent text-primary-foreground hover:opacity-90 shadow-glow"
            asChild
          >
            <a href="/register">Get started</a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm py-2 text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="/login">Sign in</a>
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-accent text-primary-foreground"
                asChild
              >
                <a href="/register">Get started</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
