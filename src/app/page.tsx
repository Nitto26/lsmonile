import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  BatteryCharging,
  Zap,
  Cable,
  Cpu,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { getAllProducts } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { HomeHero } from '@/components/HomeHero';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch real data from SQLite database
  const products = getAllProducts();
  const featuredProducts = products.slice(0, 5);

  const categories = [
    { name: 'Smartphones', icon: Smartphone, href: '/shop?category=smartphones' },
    { name: 'Tablets', icon: Tablet, href: '/shop?category=tablets' },
    { name: 'Smart Watches', icon: Watch, href: '/shop?category=smart-watches' },
    { name: 'Earbuds', icon: Headphones, href: '/shop?category=earbuds' },
    { name: 'Power Banks', icon: BatteryCharging, href: '/shop?category=power-banks' },
    { name: 'Chargers', icon: Zap, href: '/shop?category=chargers' },
    { name: 'Accessories', icon: Cable, href: '/shop?category=accessories' },
    { name: 'Components', icon: Cpu, href: '/shop?category=components' },
    { name: 'Repair Services', icon: Wrench, href: '/repair' },
  ];

  return (
    <div className="w-full">
      {/* 1. Full-bleed Hero Section with DriftWall */}
      <HomeHero />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10 space-y-16">
        {/* 2. Shop by Category */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Shop by Category
            </h2>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-bold text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
            >
              All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-800/60 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 text-zinc-300 group-hover:text-white flex items-center justify-center transition-colors mb-2">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Featured Products & Side Card */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Trending gadgets with verified authentic warranty (Loaded live from SQLite Database)
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-bold text-zinc-300 hover:text-white hover:underline"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* "Repair made simple" Side Card */}
            <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 rounded-2xl border border-zinc-700/80 p-6 flex flex-col justify-between shadow-xl text-white">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200 bg-zinc-800 border border-zinc-600 px-2.5 py-1 rounded-full">
                  Fast Service
                </span>
                <h3 className="text-xl font-black text-white mt-3 mb-2">
                  Repair made simple
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Cracked screen, dead battery, or water damage? Certified technicians fix it in under 60 minutes with 90 days warranty.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/repair"
                  className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-black/40"
                >
                  <Wrench className="w-3.5 h-3.5" /> Book a Repair
                </Link>
                <Link
                  href="/repair?track=LS-REP-8492"
                  className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
                >
                  Track Repair
                </Link>
              </div>
            </div>
          </div>

          {/* Second row of featured items from SQLite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(3, 7).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
