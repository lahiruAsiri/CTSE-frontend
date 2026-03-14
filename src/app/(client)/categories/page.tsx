'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productService, Category } from '@/services/product.service';
import { Loader2, Tag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getAllCategories();
        setCategories(data);
      } catch (err) {
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Browse by Category</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Explore our wide range of electronic devices organized by category to find exactly what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/products?category=${cat.id}`}
            className="group bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-6 h-6 text-indigo-500 transform group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-inner transition-all duration-500">
              <Tag className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors">{cat.name}</h2>
            <p className="text-gray-500 line-clamp-2 leading-relaxed">{cat.description || 'Premium electronics and next-generation accessories.'}</p>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
          <p className="text-gray-500">Check back later or browse all products.</p>
          <Link href="/products" className="mt-6 inline-block text-indigo-600 font-bold hover:underline">
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
