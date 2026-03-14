'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { productService, Product } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag, Loader2, ArrowRight, Plus, Minus, Info } from 'lucide-react';
import Link from 'next/link';

interface CartViewItem {
  id: number;
  productId: number;
  quantity: number;
  productDetails?: Product;
}

export default function CartPage() {
  const [enrichedItems, setEnrichedItems] = useState<CartViewItem[]>([]);
  const { items, loading, removeItem, updateQuantity, fetchCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const router = useRouter();

  // Load product details for cart items
  useEffect(() => {
    const enrichItems = async () => {
      if (items.length === 0 && !loading) {
          setEnrichedItems([]);
          setInitLoading(false);
          return;
      }
      
      try {
        const enriched = await Promise.all(
          items.map(async (item) => {
            try {
              const product = await productService.getProductById(item.productId);
              return { ...item, productDetails: product };
            } catch {
              return item;
            }
          })
        );
        setEnrichedItems(enriched);
      } catch (err) {
        console.error('Failed to enrich items:', err);
      } finally {
        setInitLoading(false);
      }
    };

    enrichItems();
  }, [items, loading]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setInitLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  const handleUpdateQty = async (cartItemId: number, newQty: number, stock: number) => {
    if (newQty > stock) {
      toast.error(`Only ${stock} items available in stock`, { icon: '📦' });
      return;
    }
    if (newQty < 1) {
      handleRemove(cartItemId);
      return;
    }
    
    try {
      await updateQuantity(cartItemId, newQty);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeItem(id);
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!user) return router.push('/login');
    
    setCheckingOut(true);
    try {
      await orderService.checkout();
      toast.success('Order placed successfully! Check your email.', { duration: 5000 });
      useCartStore.getState().clearCart();
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is waiting</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Sign in to view your saved items and continue your NovaTech journey.</p>
            <Link href="/login" className="w-full block bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1">
                Sign In Now
            </Link>
        </div>
      </div>
    );
  }

  if (initLoading && items.length === 0) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  const subtotal = enrichedItems.reduce((acc, item) => {
    return acc + (item.productDetails?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-4 mb-10">
          <div className="bg-gray-900 p-3 rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="text-gray-500 font-medium">Review your items before checkout</p>
          </div>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Discover the latest tech and fill your cart with innovation.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {enrichedItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm items-center gap-6 group hover:shadow-xl hover:border-indigo-100/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:bg-indigo-50/30 transition-colors">
                  {item.productDetails?.imageUrl ? (
                     <img src={item.productDetails.imageUrl} alt={item.productDetails.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <img src="/product-placeholder.png" alt="Placeholder" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                  )}
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-extrabold text-gray-900 text-xl mb-1 group-hover:text-indigo-600 transition-colors">{item.productDetails?.name || 'Loading...'}</h3>
                  <p className="text-gray-400 text-sm font-medium mb-4 flex items-center justify-center sm:justify-start gap-1">
                    <Info className="w-3.5 h-3.5" />
                    In stock: {item.productDetails?.stock || 0}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="inline-flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button 
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1, item.productDetails?.stock || 0)}
                      className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all text-gray-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1, item.productDetails?.stock || 0)}
                      className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all text-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <p className="font-black text-2xl text-gray-900 sm:mb-2">${(item.productDetails?.price || 0).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-500 p-2.5 rounded-full hover:bg-red-50 transition-all flex items-center gap-1">
                    <Trash2 className="w-5 h-5" />
                    <span className="sm:hidden text-sm font-bold">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium pb-6 border-b border-gray-50">
                  <span>Delivery</span>
                  <span className="text-emerald-500 font-bold">Standard Free</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Price</span>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">${subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="group w-full flex justify-center items-center gap-3 bg-gray-900 text-white py-5 rounded-2xl font-bold shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {checkingOut ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            Checkout Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </button>
                  
                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-6">
                      <div className="flex -space-x-2">
                          {[1,2,3,4].map(x => (
                             <div key={x} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"></div>
                          ))}
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Trusted by<br/>1,000+ Techies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

