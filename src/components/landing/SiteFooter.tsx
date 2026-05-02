import { Sprout, Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">AgriPulse</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            A smart farming decision support system built for maize and
            vegetable farmers in Rwanda and East Africa.
          </p>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#how" className="hover:text-foreground">How it works</a></li>
            <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} AgriPulse. All rights reserved.</span>
          <span>Crafted for farmers in Rwanda 🇷🇼</span>
        </div>
      </div>
    </footer>
  );
}
