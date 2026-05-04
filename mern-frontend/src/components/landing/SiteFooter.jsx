import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-accent grid place-items-center shadow-glow">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">Rwanda Beyond</span>
          </Link>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Smart farming decisions for maize and vegetable growers in Rwanda and beyond.
          </p>
        </div>
        {[
          { title: 'Product', links: [['Features', '/#features'], ['How it works', '/#how'], ['Pricing', '/#pricing']] },
          { title: 'Company', links: [['About', '/#'], ['Contact', '/#'], ['Careers', '/#']] },
          { title: 'Resources', links: [['Docs', '/#'], ['USSD guide', '/#'], ['Support', '/#']] },
        ].map((c) => (
          <div key={c.title}>
            <div className="text-sm font-semibold mb-3">{c.title}</div>
            <ul className="space-y-2 text-sm text-muted">
              {c.links.map(([l, h]) => (
                <li key={l}><a href={h} className="hover:text-[var(--text)]">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Rwanda Beyond. All rights reserved.
      </div>
    </footer>
  );
}
