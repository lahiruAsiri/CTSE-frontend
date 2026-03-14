'use client';

import { useEffect, useState } from 'react';
import { productService, Product, Category } from '@/services/product.service';
import { adminService } from '@/services/admin.service';
import { Loader2, Plus, Edit, Trash2, Tag, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0, 
    categoryId: 0, 
    imageUrl: '' 
  });

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        categoryId: prod.categoryId,
        imageUrl: prod.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: categories[0]?.id || 0,
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Implement update if needed, for now using createProduct or similar
        // Let's assume we have an updateProduct in adminService
        await adminService.updateProduct(editingProduct.id, formData);
        toast.success('Product updated');
      } else {
        await adminService.createProduct(formData);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Products Management</h1>
          <p className="text-gray-500 mt-2">Manage your electronics inventory and pricing.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="p-6">Thumbnail</th>
                <th className="p-6">Product Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Price</th>
                <th className="p-6">Stock Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="p-6 max-w-sm">
                    <div className="font-bold text-gray-900 text-lg mb-1">{p.name}</div>
                    <div className="text-gray-500 text-sm line-clamp-1">{p.description}</div>
                  </td>
                  <td className="p-6">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">
                      {categories.find(c => c.id === p.categoryId)?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="text-lg font-extrabold text-gray-900">${p.price.toFixed(2)}</div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                      p.stock > 10 ? 'bg-green-100 text-green-700' : 
                      p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        p.stock > 10 ? 'bg-green-500' : 
                        p.stock > 0 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} />
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Adjusted for light UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center px-10 py-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Update Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="col-span-2 flex gap-8 items-center bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                 <div className="w-32 h-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-10 h-10 text-gray-200" />
                    )}
                 </div>
                 <div className="flex-grow">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/laptop.jpg"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 outline-none transition-all shadow-sm"
                      value={formData.imageUrl} 
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    />
                 </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Product Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 focus:bg-white outline-none appearance-none cursor-pointer" 
                  value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                >
                  <option value={0}>Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Price ($)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Stock Units</label>
                <input 
                  required 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-indigo-600 focus:bg-white outline-none resize-none transition-all" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="col-span-2 pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
