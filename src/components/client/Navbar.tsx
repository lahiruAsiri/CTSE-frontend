'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package className="h-5 w-5" />
            </div>
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              CTSE Electronics
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</Link>
            <Link href="/categories" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Categories</Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                0
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">
                  Log In
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
