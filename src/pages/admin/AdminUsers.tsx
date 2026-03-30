import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminProfile } from '@/lib/types';
import { Plus, Trash2, X, Save, Shield, ShieldCheck, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminUsers: React.FC = () => {
  const { isSuperAdmin, user } = useAuth();
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'admin' as 'admin' | 'super_admin' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at');
    if (data) setProfiles(data);
    setLoading(false);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.full_name) {
      toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }
    if (!isSuperAdmin) {
      toast({ title: 'Error', description: 'Only super admins can create users.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    // Create user via Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData.user) {
      setSaving(false);
      toast({ title: 'Error', description: authError?.message || 'Failed to create user.', variant: 'destructive' });
      return;
    }

    // Create admin profile
    const { error: profileError } = await supabase.from('admin_profiles').insert({
      id: authData.user.id,
      full_name: form.full_name,
      role: form.role,
    });

    setSaving(false);
    if (profileError) {
      toast({ title: 'Warning', description: 'User created but profile setup may need attention.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Admin user created successfully.' });
    }
    setShowForm(false);
    setForm({ email: '', password: '', full_name: '', role: 'admin' });
    fetchProfiles();
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      toast({ title: 'Error', description: 'You cannot delete your own account.', variant: 'destructive' });
      return;
    }
    if (!confirm('Are you sure you want to delete this admin user?')) return;
    const { error } = await supabase.from('admin_profiles').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Admin user removed.' });
      fetchProfiles();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage admin users and their roles.</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium">
            <UserPlus className="w-4 h-4" /> Add Admin
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 text-sm">Only super admin users can manage other admin accounts.</p>
        </div>
      )}

      {/* Create User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Admin User</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as 'admin' | 'super_admin' }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border text-gray-600 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Joined</th>
                {isSuperAdmin && <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : profiles.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No admin users found.</td></tr>
              ) : (
                profiles.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#1F2F8F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {p.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{p.full_name}</p>
                          {p.id === user?.id && <span className="text-xs text-[#F5A623]">(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {p.role === 'super_admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {p.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-right">
                        {p.id !== user?.id && (
                          <button onClick={() => handleDeleteUser(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
