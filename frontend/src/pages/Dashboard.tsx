import { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle2, TrendingUp, Plus, CreditCard } from 'lucide-react';
import api from '../api/client';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="card flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const stats = [
    { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'bg-blue-500' },
    { icon: Clock, label: 'In Progress', value: orders.filter((o: any) => o.statusHistory?.[0]?.status === 'IN_PROGRESS').length, color: 'bg-amber-500' },
    { icon: CheckCircle2, label: 'Completed', value: orders.filter((o: any) => o.statusHistory?.[0]?.status === 'DELIVERED').length, color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Total Revenue', value: `$${orders.reduce((acc: number, o: any) => acc + Number(o.totalAmount), 0).toLocaleString()}`, color: 'bg-primary-600' },
    { icon: CreditCard, label: 'Pending Balance', value: `$${orders.reduce((acc: number, o: any) => acc + (Number(o.totalAmount) - Number(o.advanceAmount)), 0).toLocaleString()}`, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome to your order tracking command center.</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create New Order
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="card overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100">
              <tr>
                <th className="pb-4 font-semibold text-slate-600">Order #</th>
                <th className="pb-4 font-semibold text-slate-600">Customer</th>
                <th className="pb-4 font-semibold text-slate-600">Status</th>
                <th className="pb-4 font-semibold text-slate-600">Amount</th>
                <th className="pb-4 font-semibold text-slate-600">Expected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No orders found.</td></tr>
              ) : orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <Link to={`/orders/${order.id}`} className="font-bold text-primary-600">#{order.orderNumber}</Link>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-slate-900">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${order.statusHistory?.[0]?.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                        order.statusHistory?.[0]?.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'}
                    `}>
                      {order.statusHistory?.[0]?.status || 'CREATED'}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-slate-900">${Number(order.totalAmount).toLocaleString()}</td>
                  <td className="py-4 text-slate-500 text-sm">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
