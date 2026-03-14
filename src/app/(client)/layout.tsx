import Navbar from '@/components/client/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 NovaTech E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
