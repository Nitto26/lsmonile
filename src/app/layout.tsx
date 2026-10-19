import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (_) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-white selection:text-black">
        <CartProvider>
          <Suspense fallback={<div className="h-20" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
