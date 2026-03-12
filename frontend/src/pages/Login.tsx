import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-900/20 mb-6">
            <LogIn size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tracker Pro</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your orders</p>
        </div>

        <div className="card shadow-2xl shadow-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  className="input pl-12 h-14"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  className="input pl-12 h-14"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-14 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8 font-medium">
          Secure Access Monitoring Active
        </p>
      </div>
    </div>
  );
}
