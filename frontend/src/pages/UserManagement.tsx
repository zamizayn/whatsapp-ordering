import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'STAFF' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, form);
      } else {
        await api.post('/users', form);
      }
      setShowModal(false);
      setEditingUser(null);
      setForm({ name: '', username: '', password: '', role: 'STAFF' });
      fetchUsers();
    } catch (error) {
      alert('Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading user directory...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h2>
          <p className="text-slate-500 mt-1">Manage staff accounts and access permissions.</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingUser(null);
            setForm({ name: '', username: '', password: '', role: 'STAFF' });
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="card group hover:border-primary-200 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{user.name}</h3>
                  <p className="text-slate-500 text-sm">@{user.username}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                ${user.role === 'ADMIN' ? 'bg-primary-100 text-primary-700' : 
                  user.role === 'DELIVERY' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'}
              `}>
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
              <button 
                onClick={() => {
                  setEditingUser(user);
                  setForm({ name: user.name, username: user.username, password: '', role: user.role });
                  setShowModal(true);
                }}
                className="btn btn-outline flex-1 py-2 text-xs h-auto gap-1.5"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="btn bg-red-50 text-red-600 border-transparent hover:bg-red-100 py-2 text-xs h-auto shrink-0 px-3"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingUser ? 'Edit Team Member' : 'Add New Member'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">Configure user access and profile details.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input
                    required
                    className="input"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                <input
                  type="password"
                  required={!editingUser}
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                <select 
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="STAFF">Staff (Order Management)</option>
                  <option value="DELIVERY">Delivery Personnel</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Save User</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
