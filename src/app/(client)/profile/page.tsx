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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
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
                  <div key={order.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center group hover:border-indigo-100 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(order.total || 0).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
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
                    className={`p-4 rounded-2xl border transition-colors flex justify-between gap-4 ${
                      notif.read ? 'bg-gray-50 border-transparent opacity-60' : 'bg-indigo-50/50 border-indigo-100'
                    }`}
                  >
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{notif.type}</span>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                      </div>
                      <p className={`text-gray-800 ${!notif.read ? 'font-medium' : ''}`}>{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 h-fit rounded-full hover:bg-indigo-100 transition-colors"
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
