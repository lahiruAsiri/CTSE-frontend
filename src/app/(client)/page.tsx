import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-b-[4rem] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Electronics</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto mb-10">
            Discover cutting-edge laptops, premium audio, and next-gen smartphones. Powered by a highly scalable microservices architecture.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/categories" className="bg-white text-indigo-600 border border-indigo-100 px-8 py-4 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-500">Built on a distributed microservices network for zero latency shopping.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 p-4 rounded-full text-green-600 mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Checkout</h3>
              <p className="text-gray-500">Enterprise-grade JWT authentication and secure payment routing.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-50 p-4 rounded-full text-purple-600 mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Orders</h3>
              <p className="text-gray-500">Live stock updates and instant email notifications upon checkout.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
