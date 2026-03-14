'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService, Product, Category } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { ShoppingCart, Tag, Loader2, Star } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        toast.error('Failed to load catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    try {
      await orderService.addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Electronics Catalog</h1>
          <p className="text-gray-500 mt-2">Find the latest devices at the best prices.</p>
        </div>
        
        {/* Category Filter */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
             <button 
             key={cat.id}
             onClick={() => setSelectedCategory(cat.id)}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
               selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
             }`}
           >
             {cat.name}
           </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-50 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover relative z-10" />
              ) : (
                <Tag className="w-12 h-12 text-indigo-200 relative z-10 group-hover:scale-110 transition-transform" />
              )}
              {product.stock <= 5 && (
                 <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                   Only {product.stock} left
                 </span>
              )}
            </div>
            
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-extrabold text-indigo-600">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                  className={`p-2 rounded-xl transition-colors ${
                    product.stock > 0 
                      ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500">Check back later or try a different category.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-96"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
