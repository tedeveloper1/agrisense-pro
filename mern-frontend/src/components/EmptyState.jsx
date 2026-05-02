import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="surface p-10 text-center animate-fade-in">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 grid place-items-center">
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      {description && <div className="mt-1 text-sm text-muted max-w-sm mx-auto">{description}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
