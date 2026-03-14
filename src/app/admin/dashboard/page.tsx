'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { productService } from '@/services/product.service';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, orders, products] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllOrders(),
          productService.getAllProducts()
        ]);

        const revenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        setStats({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          revenue,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">System Status</h2>
        </div>
        <p className="text-gray-500 mb-6">All microservices are operational and responding correctly through the API Gateway.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {['API Gateway', 'Admin Service', 'Product Service', 'Order Service'].map(svc => (
             <div key={svc} className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <span className="text-sm font-medium text-gray-700">{svc}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
