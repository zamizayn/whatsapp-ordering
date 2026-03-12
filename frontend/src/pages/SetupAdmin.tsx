import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User as UserIcon, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function SetupAdmin() {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkUsers();
  }, []);

  const checkUsers = async () => {
    try {
      // In a real app we'd have a specific endpoint, but we can just try to see if any users exist
      // or if login fails in a certain way. For now let's assume if this page is visited, 
      // the backend will prevent creation if it already exists.
      setChecking(false);
    } catch (err) {
      navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/setup-admin', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-900/20 mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-balance">System Initial Setup</h1>
          <p className="text-slate-500 mt-2">Create the first administrative account</p>
        </div>

        <div className="card shadow-2xl shadow-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Full Name</label>
              <input
                required
                className="input h-14"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  required
                  className="input pl-12 h-14"
                  placeholder="admin"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Admin Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  className="input pl-12 h-14"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-14 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle2 size={24} /> Complete Setup</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
