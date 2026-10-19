import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ToastContainer } from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'LS Mobiles — Care. Connect. Complete. | Smartphones & Repairs',
  description: 'Official LS Mobiles store. Shop latest smartphones, premium audio, genuine accessories, and book certified device repair services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-white selection:text-black">
        <CartProvider>
          <Suspense fallback={<div className="h-20 bg-zinc-950" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
