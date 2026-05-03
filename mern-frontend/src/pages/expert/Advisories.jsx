import { useEffect, useState } from 'react';
import { MessagesSquare } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export default function Advisories() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/expert/advisories').then((r) => setItems(r.data.advisories || [])).catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Advisories" description="Public guidance shared with the farmer community." />

      {items.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No advisories yet" />
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <div key={a._id} className="surface p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{a.title}</h3>
                <span className="text-xs text-muted">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{a.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
