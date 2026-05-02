import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { PageSkeleton } from '../../components/Skeleton';

const STATUS = {
  pending: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20',
  approved: 'bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20',
  rejected: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20',
};

export default function ExpertDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/expert/dashboard')
      .then((r) => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Expert workspace" description="Triage AI recommendations and send advisories." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ClipboardCheck} label="Pending reviews" value={data?.pending ?? 0} accent="amber" />
      </div>

      <div className="surface p-5">
        <h2 className="font-semibold mb-4">Recent recommendations</h2>
        {!data?.recent?.length ? (
          <EmptyState title="No recent activity" description="Once farmers submit data, recommendations will queue here." />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)]">
                  <th className="px-5 py-2.5 font-medium">Title</th>
                  <th className="px-5 py-2.5 font-medium">Farmer</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r) => (
                  <tr key={r._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-3 font-medium">{r.title}</td>
                    <td className="px-5 py-3 text-muted">{r.user?.name}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${STATUS[r.status] || STATUS.pending}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
