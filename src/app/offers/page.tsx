'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, ArrowRight, Copy, Check } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function OffersPage() {
  const { showToast } = useCart();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error);
  }, []);

  const coupons = [
    {
      code: 'WELCOME10',
      discount: '10% OFF',
      description: 'Applicable on all audio devices, power banks, and accessories.',
      minSpend: '₹999',
    },
    {
      code: 'FLAT500',
      discount: 'FLAT ₹500 OFF',
      description: 'Instant discount on all flagship smartphone orders above ₹30,000.',
      minSpend: '₹30,000',
    },
    {
      code: 'LSMOBILE',
      discount: '15% OFF REPAIRS',
      description: 'Exclusive discount code on screen and battery replacements.',
      minSpend: '₹1,499',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Coupon Copied!', `Code "${code}" copied to clipboard. Apply at checkout!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const discountedProducts = products.filter((p) => p.discount >= 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full">
            Special Deals & Promotions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Big Deals, Bigger Savings.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Exclusive online coupon codes, clearance sales, and bundled accessories offers.
          </p>
        </div>
      </div>

      {/* Active Coupons Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Active Coupon Codes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-zinc-900/60 rounded-2xl border-2 border-dashed border-zinc-700 p-6 flex flex-col justify-between hover:border-zinc-500 transition-colors shadow-xs text-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-black text-white">{c.discount}</span>
                  <Tag className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{c.description}</p>
                <span className="text-[11px] text-zinc-500 font-semibold block mb-4">
                  Min Spend: {c.minSpend}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-white tracking-wider">
                  {c.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(c.code)}
                  className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-zinc-950" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Discounted Items */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Heavily Discounted Tech (Up to 50% Off)
          </h2>
          <Link
            href="/shop"
            className="text-xs font-bold text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
          >
            All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
