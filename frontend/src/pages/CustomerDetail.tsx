import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Clock, 
  Package, 
  ExternalLink,
  Smartphone,
  Edit2,
  Save,
  X
} from 'lucide-react';
import api from '../api/client';
import { format } from 'date-fns';

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '', email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/customers/${id}`);
      setCustomer(response.data);
      setEditForm({
        name: response.data.name,
        phoneNumber: response.data.phoneNumber,
        email: response.data.email || ''
      });
    } catch (error) {
      console.error('Failed to fetch customer detail');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch(`/customers/${id}`, editForm);
      setCustomer({ ...customer, ...response.data });
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading customer details...</div>;
  if (!customer) return <div className="p-8 text-center text-red-500">Customer not found</div>;

  const totalSpent = customer.orders.reduce((acc: number, order: any) => acc + parseFloat(order.totalAmount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers" className="p-2 hover:bg-white rounded-xl transition-all text-slate-500 hover:text-primary-600 border border-transparent hover:border-slate-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{customer.name}</h2>
            <p className="text-slate-500">Customer Profile & Order History</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
        >
          {isEditing ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card space-y-6">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Contact Information</h3>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <input 
                    className="input" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone (WhatsApp)</label>
                  <input 
                    className="input" 
                    value={editForm.phoneNumber}
                    onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                  <input 
                    className="input" 
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">WhatsApp</p>
                    <p className="text-slate-900 font-medium">{customer.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
                    <p className="text-slate-900 font-medium">{customer.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Customer Since</p>
                    <p className="text-slate-900 font-medium">{format(new Date(customer.createdAt), 'MMMM yyyy')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Orders</p>
                <p className="text-xl font-bold text-slate-900">{customer.orders.length}</p>
              </div>
              <div className="text-center p-3 bg-primary-50 rounded-2xl">
                <p className="text-xs font-bold text-primary-400 uppercase">Total Spent</p>
                <p className="text-xl font-bold text-primary-700">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Orders History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Order History</h3>
          </div>

          <div className="space-y-4">
            {customer.orders.map((order: any) => {
              const latestStatus = order.statusHistory?.[0]?.status || 'CREATED';
              
              return (
                <div key={order.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-primary-500">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
                          <Package size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-lg">#{order.orderNumber}</h4>
                            <span className="badge badge-primary">{latestStatus}</span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1">{order.description}</p>
                        </div>
                      </div>
                      <Link to={`/orders/${order.id}`} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 transition-all">
                        <ExternalLink size={18} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created On</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Clock size={14} className="text-slate-400" />
                          {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium border-l border-slate-100 pl-8">
                          <Calendar size={14} className="text-slate-400" />
                          {format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}
                        </div>
          

            </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-xl font-black text-slate-900">${parseFloat(order.totalAmount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {customer.orders.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-400">
                No orders found for this customer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
