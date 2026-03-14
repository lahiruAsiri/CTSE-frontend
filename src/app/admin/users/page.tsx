'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Loader2, ShieldCheck, User, Mail, Hash, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id: number, role: 'USER' | 'ADMIN') => {
    setUpdatingId(id);
    try {
      await adminService.updateUserRole(id, role);
      toast.success(`User #${id} is now an ${role}`);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      <p className="text-gray-500 font-medium animate-pulse">Consulting user directory...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Access Control</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage user permissions and administrative roles</p>
        </div>
        <div className="bg-purple-50 px-5 py-2.5 rounded-2xl border border-purple-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-purple-700 font-bold">{users.length} Registered Identities</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100 text-gray-400 text-[0.65rem] uppercase tracking-[0.2em] font-bold">
                <th className="px-10 py-7">Member</th>
                <th className="px-8 py-7">Access Level</th>
                <th className="px-10 py-7 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {users.map(u => (
                <tr key={u.id} className="group hover:bg-indigo-50/30 transition-all duration-500">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                        u.role === 'ADMIN' 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-white border-2 border-gray-100 shadow-sm'
                      }`}>
                        {u.role === 'ADMIN' 
                          ? <ShieldCheck className="w-7 h-7 text-white" /> 
                          : <User className="w-7 h-7 text-gray-400" />
                        }
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{u.name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[0.7rem] text-gray-400 font-bold uppercase tracking-wider">
                            <Mail className="w-3 h-3" /> {u.email}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="flex items-center gap-1 text-[0.7rem] text-gray-400 font-bold uppercase tracking-wider">
                            <Hash className="w-3 h-3" /> ID: {u.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm transition-all duration-300 ${
                      u.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700 border-purple-200 font-bold' 
                      : 'bg-gray-50 text-gray-600 border-gray-100 font-semibold'
                    }`}>
                      {u.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                      <span className="text-[0.75rem] tracking-widest uppercase">{u.role}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    {updatingId === u.id ? (
                      <div className="flex items-center justify-end pr-4">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 group/btns">
                        <button
                          onClick={() => handleUpdateRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className={`relative overflow-hidden group/btn px-6 py-2.5 rounded-2xl text-[0.7rem] font-bold tracking-widest uppercase transition-all active:scale-95 ${
                            u.role === 'ADMIN'
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                             {u.role === 'ADMIN' ? 'Revoke Shield' : 'Promote to Admin'}
                          </span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
