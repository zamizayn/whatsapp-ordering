import { useState, useEffect } from 'react';
import { Save, RefreshCcw, ShieldCheck, Smartphone, Hash } from 'lucide-react';
import api from '../api/client';

export default function Settings() {
  const [settings, setSettings] = useState<any>({
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: '',
    TWILIO_WHATSAPP_NUMBER: '',
    TWILIO_CONTENT_SID: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings((prev: any) => ({ ...prev, ...response.data }));
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.post('/settings', settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h2>
        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={18} /> {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="card space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Twilio Credentials</h3>
              <p className="text-sm text-slate-500">API keys for your Twilio account.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Account SID</label>
              <input 
                className="input" 
                placeholder="AC..."
                value={settings.TWILIO_ACCOUNT_SID}
                onChange={e => setSettings({...settings, TWILIO_ACCOUNT_SID: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Auth Token</label>
              <input 
                type="password"
                className="input" 
                placeholder="••••••••••••••••"
                value={settings.TWILIO_AUTH_TOKEN}
                onChange={e => setSettings({...settings, TWILIO_AUTH_TOKEN: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2">
              <Smartphone size={14} /> WhatsApp Sender Number
            </label>
            <input 
              className="input" 
              placeholder="whatsapp:+14155238886"
              value={settings.TWILIO_WHATSAPP_NUMBER}
              onChange={e => setSettings({...settings, TWILIO_WHATSAPP_NUMBER: e.target.value})}
            />
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2">
              <Hash size={14} /> Global Content Template SID
            </label>
            <input 
              className="input" 
              placeholder="HX..."
              value={settings.TWILIO_CONTENT_SID}
              onChange={e => setSettings({...settings, TWILIO_CONTENT_SID: e.target.value})}
            />
            <p className="text-[11px] text-slate-400 mt-1 italic">
              * This SID will be used for all notifications (Order, Status, Invoice).
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={fetchSettings}
            className="btn btn-outline flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Reset
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 px-8 py-3 text-lg shadow-xl shadow-primary-200"
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
