import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Eye, FileText, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o: any) => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Manage Orders</h2>
          <p className="text-slate-500">Search and manage all customer orders.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by order number or customer name..." 
            className="input pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline flex items-center gap-2">
          <Filter size={20} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No orders found matching your search.</div>
        ) : filteredOrders.map((order: any) => (
          <div key={order.id} className="card hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                  <span className="text-xl font-bold text-slate-400 group-hover:text-primary-500">
                    #{order.orderNumber.split('-')[1]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">#{order.orderNumber}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{order.customer.name}</span>
                    <span>•</span>
                    <span>{order.customer.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Total</p>
                  <p className="text-lg font-bold text-slate-900">${Number(order.totalAmount).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${order.statusHistory?.[0]?.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                      order.statusHistory?.[0]?.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'}
                  `}>
                    {order.statusHistory?.[0]?.status || 'CREATED'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/orders/${order.id}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="View Details">
                    <Eye size={20} />
                  </Link>
                  <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="WhatsApp Log">
                    <Smartphone size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Invoices">
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
