'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success('Order status updated');
      fetchOrders(); // Refresh
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Orders Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">#{o.id}</td>
                  <td className="p-4 text-gray-600">ID: {o.userId}</td>
                  <td className="p-4 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-900 font-bold">${(o.total || 0).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      className="text-sm p-1.5 border rounded-lg bg-white"
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
