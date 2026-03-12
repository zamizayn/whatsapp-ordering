import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit2, Loader2, CheckCircle2, DollarSign, Tag, Info } from 'lucide-react';
import api from '../api/client';

export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, {
          ...formData,
          price: Number(formData.price),
        });
      } else {
        await api.post('/products', {
          ...formData,
          price: Number(formData.price),
        });
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: 'General', description: '', price: '' });
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price.toString(),
    });
    setShowModal(true);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="text-slate-500">Manage your business offerings and pricing.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', category: 'General', description: '', price: '' });
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center gap-2 px-6"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card group hover:border-primary-500/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <Package size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(product)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{product.name}</h3>
                <span className="text-xl font-black text-primary-600">${Number(product.price).toLocaleString()}</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
              <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] italic">
                {product.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              {editingProduct ? <Edit2 size={24} className="text-primary-500" /> : <Plus size={24} className="text-primary-500" />}
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    className="input pl-12"
                    placeholder="e.g. Wedding Photography Pack"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="input appearance-none bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Services">Services</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="number"
                      className="input pl-12"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <div className="relative">
                  <Info className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    className="input pl-12 py-3 h-24 resize-none"
                    placeholder="Brief details about the product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-outline py-4 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 btn btn-primary py-4 font-black flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
