import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CTSE Electronics',
  description: 'Premium electronics store with microservices backend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
            }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
