'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Loader2, Package, Truck, CheckCircle2, XCircle, Clock, ChevronDown, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig: any = {
  PENDING: { color: 'bg-amber-100 text-amber-900 border-amber-200', icon: Clock },
  SHIPPED: { color: 'bg-blue-100 text-blue-900 border-blue-200', icon: Truck },
  DELIVERED: { color: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: CheckCircle2 },
  CANCELLED: { color: 'bg-rose-100 text-rose-900 border-rose-200', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
    setUpdatingId(id);
    setOpenMenuId(null);
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success(`Order #${id} updated to ${status}`);
      await fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Orders Fulfillment</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and update lifecycle of customer purchases</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-[0.65rem] text-gray-400 font-bold uppercase tracking-widest">Active Pool</p>
            <p className="text-gray-900 font-bold leading-none">{orders.length} Orders</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[0.65rem] uppercase tracking-[0.2em] font-bold">
                <th className="px-10 py-7">Invoicing</th>
                <th className="px-6 py-7 text-center">Placed</th>
                <th className="px-6 py-7">Revenue</th>
                <th className="px-6 py-7">Current State</th>
                <th className="px-10 py-7 text-right">Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => {
                const Config = statusConfig[o.status] || { color: 'bg-gray-100 text-gray-700', icon: Clock };
                const StatusIcon = Config.icon;

                return (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-all duration-300">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-gray-200">
                          #{o.id}
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900 leading-tight">Customer #{o.userId}</p>
                          <p className="text-[0.7rem] text-gray-400 mt-1 font-semibold uppercase tracking-widest leading-none">
                            {o.items?.length || 0} Products
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-7 text-center">
                      <p className="text-sm text-gray-900 font-semibold">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[0.65rem] text-gray-400 font-bold uppercase mt-0.5">
                        {new Date(o.createdAt).getFullYear()}
                      </p>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 leading-none">${(o.total || 0).toFixed(2)}</span>
                        <span className="text-[0.65rem] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">Verified</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${Config.color} shadow-sm group/status`}>
                        <StatusIcon className="w-4 h-4 shadow-sm" />
                        <span className="text-[0.7rem] font-bold tracking-widest uppercase">{o.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right relative overflow-visible">
                      {updatingId === o.id ? (
                        <div className="flex justify-end pr-8">
                           <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        </div>
                      ) : (
                        <div className="inline-block relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === o.id ? null : o.id)}
                            className="flex items-center gap-2 ml-auto bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-[0.7rem] tracking-widest uppercase hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 shadow-md"
                          >
                            Update <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openMenuId === o.id ? 'rotate-180' : ''}`} />
                          </button>

                          {openMenuId === o.id && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                              {Object.keys(statusConfig).map((status) => (
                                <button
                                  key={status}
                                  disabled={status === o.status}
                                  onClick={() => handleUpdateStatus(o.id, status)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.7rem] font-bold tracking-widest uppercase transition-colors ${
                                    status === o.status 
                                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                                  }`}
                                >
                                  {status === 'PENDING' && <Clock className="w-4 h-4" />}
                                  {status === 'SHIPPED' && <Truck className="w-4 h-4" />}
                                  {status === 'DELIVERED' && <CheckCircle2 className="w-4 h-4" />}
                                  {status === 'CANCELLED' && <XCircle className="w-4 h-4" />}
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
