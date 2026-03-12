import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Phone, Mail, DollarSign, Calendar, Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../api/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Item {
  productName: string;
  quantity: number;
  unitPrice: number;
}

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([{ productName: '', quantity: 1, unitPrice: 0 }]);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    description: '',
    totalAmount: '0',
    advanceAmount: '',
    expectedDeliveryDate: '',
  });

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setFormData(prev => ({ ...prev, totalAmount: total.toString() }));
  }, [items]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        advanceAmount: Number(formData.advanceAmount) || 0,
        expectedDeliveryDate: new Date(formData.expectedDeliveryDate),
        items: items.filter(i => i.productName),
      });
      navigate('/orders');
    } catch (error: any) {
      console.error('Failed to create order:', error);
      const message = error.response?.data?.error || 'Failed to create order. Please check your input.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleCatalogSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newItems = [...items];
      newItems[index] = {
        productName: product.name,
        quantity: 1,
        unitPrice: Number(product.price),
      };
      setItems(newItems);
    }
  };

  const addItem = () => setItems([...items, { productName: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Order & Inventory</h2>
          <p className="text-slate-500">Add customer details and list line items for tracking.</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-outline flex items-center gap-2">
          <X size={20} /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <div className="card grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Customer Name *</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required name="customerName" value={formData.customerName} onChange={handleChange} className="input pl-12" placeholder="John Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input pl-12" placeholder="+1234567890" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input pl-12" placeholder="john@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expected Delivery *</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
              <DatePicker
                selected={formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : null}
                onChange={(date: Date | null) => setFormData({ ...formData, expectedDeliveryDate: date ? date.toISOString().split('T')[0] : '' })}
                className="input pl-12 w-full"
                placeholderText="Select delivery date"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                required
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Order Items</label>
            <button type="button" onClick={addItem} className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end animate-in fade-in duration-200">
                <div className="flex-1 space-y-1.5">
                  <div className="flex gap-2">
                    <select
                      className="input h-11 w-1/3 bg-slate-50 border-slate-200"
                      onChange={(e) => handleCatalogSelect(index, e.target.value)}
                      value=""
                    >
                      <option value="" disabled>From Catalog...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                      ))}
                    </select>
                    <input
                      required={index === 0}
                      placeholder="Or type product/service name..."
                      className="input h-11 flex-1"
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-24 space-y-1.5">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="input h-11 text-center"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-32 space-y-1.5">
                  <input
                    type="number"
                    placeholder="Price"
                    className="input h-11"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="btn bg-rose-50 text-rose-500 border-transparent hover:bg-rose-100 h-11 px-3">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Order Summary / Notes *</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="input" placeholder="Enter special instructions or order notes..." />
        </div>

        <div className="card grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-white">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Total Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="input bg-slate-800 border-slate-700 text-white pl-12 h-14 text-xl font-bold" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-primary-400">Advance Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500/50" size={18} />
              <input type="number" name="advanceAmount" value={formData.advanceAmount} onChange={handleChange} className="input bg-slate-800 border-slate-700 text-white pl-12 h-14 text-xl font-bold focus:border-primary-500" placeholder="0.00" />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-8 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary px-12 py-4 text-lg font-black flex items-center gap-2 shadow-2xl shadow-primary-900/40">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> Create Order</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
