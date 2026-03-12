import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ChevronRight, Phone } from 'lucide-react';
import api from '../api/client';
import { format } from 'date-fns';

export default function CustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers', { params: { search } });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-500 font-medium">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h2>
          <p className="text-slate-500 mt-1">Manage your customer database and order history.</p>
        </div>

        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search name, phone or email..."
            className="input pl-12 pr-4 py-3 h-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Link
            key={customer.id}
            to={`/customers/${customer.id}`}
            className="card group hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                    {customer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
                    <Phone size={14} className="text-slate-400" />
                    <span>{customer.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" size={20} />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Orders</span>
                <span className="text-slate-900 font-bold text-lg">{customer.totalOrders}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Last Active</span>
                <span className="text-slate-600 font-medium">{format(new Date(customer.lastActive), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </Link>
        ))}

        {customers.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Users size={48} className="opacity-20" />
            <p className="font-medium">No customers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
