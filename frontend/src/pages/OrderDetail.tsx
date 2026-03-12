import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  Printer,
  Smartphone
} from 'lucide-react';
import api from '../api/client';
import { QRCodeCanvas } from 'qrcode.react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status, actor: 'ADMIN' });
      await fetchOrder();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      const response = await api.post(`/orders/${id}/invoice`);
      alert(`Invoice generated: ${response.data.invoiceNumber}`);
      await fetchOrder();
    } catch (err) {
      alert('Failed to generate invoice');
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-20 bg-slate-50 min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Loading Tracker Data...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const currentStatus = order.statusHistory?.[0]?.status || 'CREATED';

  const statusColors: any = {
    CREATED: 'bg-slate-100 text-slate-700',
    ADVANCE_RECEIVED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    READY: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Printable Label View (Hidden by default) */}
      <div className="hidden print:block print:p-8 bg-white border-2 border-slate-900 rounded-[2rem] max-w-sm mx-auto text-center space-y-6">
        <h2 className="text-3xl font-black">{order.orderNumber}</h2>
        <div className="flex justify-center p-4 bg-slate-50 rounded-3xl">
          <QRCodeCanvas value={`${window.location.origin}/orders/${order.id}`} size={200} />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-xl">{order.customer.name}</p>
          <p className="text-slate-500">{order.customer.phoneNumber}</p>
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Scan to Update Status</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Orders
        </button>
        <div className="flex items-center gap-3">
          {/* <button onClick={handlePrintLabel} className="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Printer size={20} /> Print Label
          </button> */}
          <button onClick={handleGenerateInvoice} className="btn btn-outline flex items-center gap-2">
            <Smartphone size={20} /> Send Invoice
          </button>
          <div className="relative">
            <select
              disabled={updating}
              className={`btn appearance-none pr-10 font-bold uppercase tracking-wider ${statusColors[currentStatus]}`}
              value={currentStatus}
              onChange={(e) => handleUpdateStatus(e.target.value)}
            >
              {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2 space-y-8">
          <div className="card space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center justify-center">
                  <QRCodeCanvas value={`${window.location.origin}/orders/${order.id}`} size={80} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Order #{order.orderNumber}</h2>
                  <p className="text-slate-500 font-medium">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm ${statusColors[currentStatus]}`}>
                {currentStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-50">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600">
                      <Phone size={20} />
                    </div>
                    <p className="font-bold text-slate-900">{order.customer.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Logistic Info</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Due Date</p>
                    <p className="font-black text-rose-600">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Inventory</h4>
              <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Item</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items?.length > 0 ? (
                      order.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 font-bold text-slate-900">{item.productName}</td>
                          <td className="px-6 py-4 text-center font-medium text-slate-500">{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">${Number(item.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic font-medium">
                          No specific items listed. Check description.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Special Instructions</h4>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 leading-relaxed text-slate-700 font-medium italic">
                {order.description}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-slate-900">${Number(order.totalAmount).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-600 mb-1">Paid Amount</p>
                <p className="text-xl font-bold text-green-700">${Number(order.advanceAmount).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-xl">
                <p className="text-sm text-primary-600 mb-1">Balance Due</p>
                <p className="text-xl font-bold text-primary-700">
                  ${(Number(order.totalAmount) - Number(order.advanceAmount)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Timeline</h3>
            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {order.statusHistory?.map((history: any, i: number) => (
                <div key={history.id} className="relative pl-10">
                  <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center z-10
                    ${i === 0 ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-slate-200 text-slate-500'}
                  `}>
                    {i === 0 ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">{history.status}</p>
                    <p className="text-sm text-slate-500">{new Date(history.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1 italic">Updated by {history.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
              WhatsApp Logs
              <Smartphone size={18} className="text-slate-400" />
            </h3>
            {order.messageLogs?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No messages sent yet.</p>
            ) : (
              <div className="space-y-4">
                {order.messageLogs?.map((log: any) => (
                  <div key={log.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-700 uppercase">{log.templateId || 'DIRECT'}</p>
                      <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                      ${log.status === 'SENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
