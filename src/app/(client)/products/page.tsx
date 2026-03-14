'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService, Product, Category } from '@/services/product.service';
import { useCartStore } from '@/store/useCartStore';
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
  const addItem = useCartStore(state => state.addItem);

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

  const cartItems = useCartStore(state => state.items);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    const existingInCart = cartItems.find(item => item.productId === product.id);
    const currentQty = existingInCart ? existingInCart.quantity : 0;

    if (currentQty + 1 > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`, { icon: '📦' });
      return;
    }
    
    try {
      await addItem(product.id, 1);
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
          <div key={product.id} className="group relative h-[26rem] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white">
            {/* Full Image Background */}
            <div className="absolute inset-0 bg-gray-50 group-hover:bg-indigo-50/30 transition-colors">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              ) : (
                <img src="/product-placeholder.png" alt="Placeholder" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              )}
              {/* Subtle Gradient for Bottom Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            </div>

            {/* Badges top right */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
              {product.stock <= 5 && product.stock > 0 && (
                 <span className="bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                   Only {product.stock} left
                 </span>
              )}
              {product.stock === 0 && (
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Floating White Box at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-2">
                    <h3 className="font-extrabold text-gray-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-gray-700">4.9</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium line-through">${(product.price * 1.2).toFixed(2)}</span>
                    <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                    disabled={product.stock === 0}
                    className={`p-2.5 rounded-xl transition-all flex items-center gap-2 font-bold shadow-sm ${
                      product.stock > 0 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
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
