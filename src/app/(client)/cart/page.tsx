'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderService, CartItem } from '@/services/order.service';
import { productService, Product } from '@/services/product.service';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartViewItem extends CartItem {
  productDetails?: Product;
}

export default function CartPage() {
  const [items, setItems] = useState<CartViewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const fetchCartItems = async () => {
    if (!isAuthenticated) return;
    try {
      const cartData = await orderService.getCart();
      
      // Fetch product details for each cart item
      const enrichedItems = await Promise.all(
        cartData.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            return { ...item, productDetails: product };
          } catch {
            return item;
          }
        })
      );
      
      setItems(enrichedItems);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (id: number) => {
    try {
      await orderService.removeFromCart(id);
      toast.success('Item removed');
      fetchCartItems();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!user) return router.push('/login');
    
    setCheckingOut(true);
    try {
      const order = await orderService.checkout();
      toast.success('Order placed successfully! Check your email.');
      setItems([]);
      router.push('/profile'); // Redirect to profile to see order history later
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view cart</h2>
        <Link href="/login" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium">Log In</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.productDetails?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex bg-white p-4 rounded-2xl border border-gray-100 shadow-sm items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center">
                  {item.productDetails?.imageUrl ? (
                     <img src={item.productDetails.imageUrl} alt={item.productDetails.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <ShoppingBag className="text-gray-300" />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900">{item.productDetails?.name || 'Loading...'}</h3>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">${(item.productDetails?.price || 0).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-600 mt-2 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {checkingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Checkout'}
                {!checkingOut && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
