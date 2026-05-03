import { useEffect, useState } from 'react';
import { Trash2, Users as UsersIcon } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

const ROLE_BADGE = {
  farmer: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
  admin: 'bg-indigo-500/15 text-indigo-500',
  expert: 'bg-amber-500/15 text-amber-500',
};

export default function Users({ filterRole }) {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const load = () => api.get('/admin/users').then((r) => setUsers(r.data.users || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm('Delete user?')) return; await api.delete(`/admin/users/${id}`); load(); };
  const updateRole = async (id, role) => { await api.put(`/admin/users/${id}`, { role }); load(); };

  const list = (filterRole ? users.filter((u) => u.role === filterRole) : users)
    .filter((u) => !q || (u.name + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title={filterRole ? `${filterRole}s` : 'Users'}
        description="Manage platform members and their roles."
        actions={
          <input
            className="input !w-64"
            placeholder="Search users…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        }
      />

      <div className="surface overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-[var(--border)]">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-accent grid place-items-center text-white text-xs font-semibold">
                        {(u.name || '?').slice(0,1).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      className={`badge !px-2.5 !py-1 cursor-pointer ${ROLE_BADGE[u.role]}`}
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                    >
                      <option value="farmer">farmer</option>
                      <option value="expert">expert</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => del(u._id)} className="btn-ghost !text-rose-500 !px-2 h-8">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
