import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Users({ filterRole }) {
  const [users, setUsers] = useState([]);
  const load = () => api.get('/admin/users').then((r) => setUsers(r.data.users));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm('Delete user?')) return; await api.delete(`/admin/users/${id}`); load(); };
  const updateRole = async (id, role) => { await api.put(`/admin/users/${id}`, { role }); load(); };
  const list = filterRole ? users.filter((u) => u.role === filterRole) : users;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{filterRole ? `${filterRole}s` : 'Users'}</h1>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2"></th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td><td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select className="border rounded px-1 py-0.5" value={u.role} onChange={(e)=>updateRole(u._id, e.target.value)}>
                    <option value="farmer">farmer</option><option value="expert">expert</option><option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-2 text-right"><button onClick={()=>del(u._id)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
