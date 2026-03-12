import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, Smartphone, Clock } from 'lucide-react';
import api from '../api/client';

const CustomerEntry = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    description: '',
    expectedDeliveryDate: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Customer places order - we assume total amount is estimated or left for admin
      await api.post('/orders', {
        ...formData,
        customerName: formData.name,
        totalAmount: 0, // Placeholder
      });
      setSuccess(true);
    } catch (err) {
      alert('Error submitting order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Order Placed!</h2>
          <p className="text-slate-500">
            Thank you for your order. You will receive an automated confirmation on WhatsApp shortly.
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 text-left">
            <Smartphone className="text-whatsapp" size={24} />
            <p className="text-sm text-slate-600 font-medium">
              We'll send updates to <strong>{formData.phoneNumber}</strong>
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="btn btn-primary w-full py-4 text-lg">
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl rotate-3 mb-4">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center">Quick Order</h1>
          <p className="text-slate-500 font-medium">Get started with your request in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Your Full Name</label>
              <input required className="input bg-slate-50 border-transparent py-4" placeholder="e.g. Alex Smith" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp Number</label>
              <input required className="input bg-slate-50 border-transparent py-4" placeholder="+1234567890" 
                value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">What can we do for you?</label>
              <textarea required className="input bg-slate-50 border-transparent py-4" rows={3} placeholder="Describe your order details..." 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                <Clock size={14} /> Expected Delivery Date
              </label>
              <input required type="date" className="input bg-slate-50 border-transparent py-4" 
                value={formData.expectedDeliveryDate} onChange={e => setFormData({...formData, expectedDeliveryDate: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 text-xl font-bold shadow-lg shadow-primary-200">
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm">
          Protected by automated WhatsApp tracking.
        </p>
      </div>
    </div>
  );
};

export default CustomerEntry;
