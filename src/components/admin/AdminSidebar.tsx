'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Activity, 
  LogOut,
  Settings,
  Tag
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'System Logs', href: '/admin/logs', icon: Activity },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded-md">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Admin Panel</span>
        </Link>
      </div>

      <div className="flex-grow py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
