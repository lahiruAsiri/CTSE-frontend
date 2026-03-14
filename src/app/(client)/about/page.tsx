import { Shield, Zap, Target, Users } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="NovaTech About" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-30 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-6">Pioneering the Future of Electronics</h1>
          <p className="text-xl text-gray-300">NovaTech is more than just a store. We are a technology company building next-generation shopping experiences powered by distributed microservices.</p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              At NovaTech, we believe that purchasing premium electronics should be as seamless and futuristic as the devices themselves. 
              Our platform is engineered from the ground up using a state-of-the-art microservices architecture.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              By decoupling our Admin, Product, Order, and Notification services, we guarantee zero latency, infinite scalability, and military-grade security for every single transaction.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'Innovation', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Security', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
              { title: 'Precision', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Community', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className={`p-4 rounded-full ${v.bg} ${v.color} mb-4`}>
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900">{v.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Note */}
      <div className="max-w-7xl mx-auto px-4 mt-32">
        <div className="bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Powered by Microservices</h2>
            <p className="text-indigo-100 text-lg mb-8">
              NovaTech runs on a sophisticated API Gateway routing requests to specialized, containerized backend services running NestJS and Prisma.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {['API Gateway', 'Admin Service', 'Product Service', 'Order Service', 'Auth Guards'].map(sys => (
                <span key={sys} className="px-4 py-2 bg-indigo-500/50 backdrop-blur-md rounded-full text-sm font-bold border border-indigo-400/30">
                  {sys}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
