import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="NovaTech Hero Background" 
            layout="fill" 
            objectFit="cover" 
            priority
            className="opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Welcome to the Next Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Digital Life</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto mb-10 drop-shadow">
            NovaTech brings you the pinnacle of consumer electronics. Immersive audio, unparalleled computing, and seamless smart home integration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2">
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/categories" className="bg-gray-800/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center justify-center">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections / Categories Preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Innovation</h2>
            <p className="text-gray-500 mt-2">Curated electronics for the modern era.</p>
          </div>
          <Link href="/products" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { tag: 'Audio', title: 'Spatial Sound Mastery', color: 'from-blue-500 to-cyan-400' },
            { tag: 'Computing', title: 'Unhindered Performance', color: 'from-purple-500 to-indigo-500' },
            { tag: 'Smart Home', title: 'Seamless Integration', color: 'from-emerald-400 to-teal-500' },
          ].map((item, i) => (
            <div key={i} className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gray-100">
                <Image 
                  src="/product-placeholder.png" 
                  alt={item.title} 
                  layout="fill" 
                  objectFit="cover" 
                  className="group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} mix-blend-multiply opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block border border-white/30">
                  {item.tag}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2 text-white/80 text-sm font-medium">
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Features */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-16">The NovaTech Advantage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-sm">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ultra-Fast Dispatch</h3>
              <p className="text-gray-500 leading-relaxed">Orders process in milliseconds through our distributed microservices network guaranteeing same-day shipping.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group hover:bg-indigo-600 hover:text-white transition-colors duration-300 shadow-sm">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Grade Security</h3>
              <p className="text-gray-500 leading-relaxed">Every transaction is secured with enterprise-grade JWT authentication and encrypted payment routing.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group hover:bg-purple-600 hover:text-white transition-colors duration-300 shadow-sm">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-500 leading-relaxed">We source and stock only the highest echelon of consumer electronics from trusted global manufacturers.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter / CTA */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Join the NovaTech Club</h2>
          <p className="text-gray-400 text-lg mb-8">Get exclusive access to new drops, special promotions, and tech insights delivered straight to your inbox.</p>
          <div className="flex max-w-md mx-auto relative">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-4 pl-6 pr-32 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
