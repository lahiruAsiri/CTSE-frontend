'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/order.service';
import { notificationService, Notification } from '@/services/notification.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Package, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersData, notifsData] = await Promise.all([
          orderService.getOrderHistory(),
          notificationService.getMyInbox(),
        ]);
        setOrders(ordersData);
        setNotifications(notifsData);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-[2.5rem] p-10 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
              <span className="text-3xl font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome back, {user?.name}</h1>
              <p className="text-indigo-200 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 border border-gray-100 rounded-3xl flex justify-between items-center group hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Package className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors cursor-pointer">Order #{order.id}</p>
                        <p className="text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-black text-gray-900 text-lg">${(order.total || 0).toFixed(2)}</p>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200/50' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border border-blue-200/50' :
                        'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>

            {notifications.length === 0 ? (
              <p className="text-gray-500 italic">You have no notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-5 rounded-3xl border transition-all duration-300 flex justify-between gap-4 group ${
                      notif.read ? 'bg-gray-50/50 border-gray-100 opacity-70' : 'bg-white border-purple-100 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.1)] hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-gray-200' : 'bg-purple-100 text-purple-600'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex gap-2 items-center mb-1">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{notif.type}</span>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>}
                        </div>
                        <p className={`text-gray-900 leading-relaxed ${!notif.read ? 'font-bold' : 'font-medium text-gray-600'}`}>{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(notif.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-purple-600 hover:text-white p-2 h-fit rounded-full hover:bg-purple-500 transition-colors bg-purple-50 group-hover:shadow-md"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
