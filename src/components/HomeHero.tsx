'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Smartphone } from 'lucide-react';
import DriftWall from './DriftWall';

const HERO_WALL_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    title: 'Screen Replacement',
    href: '/repair?service=screen-replacement'
  },
  {
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    title: 'iPhone 15 Pro Titanium',
    href: '/product/iphone-15'
  },
  {
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
    title: 'Level-4 Micro-Soldering',
    href: '/repair?service=water-damage'
  },
  {
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    title: 'Samsung Galaxy S24 Ultra',
    href: '/product/samsung-galaxy-s24'
  },
  {
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b805327?w=800&auto=format&fit=crop&q=80',
    title: 'Genuine Battery Swap',
    href: '/repair?service=battery-replacement'
  },
  {
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    title: 'Flagship Triple Cameras',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
    title: 'ESD-Safe Certified Station',
    href: '/repair'
  },
  {
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    title: 'LTPO AMOLED Display',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    title: 'Camera & Optical Repair',
    href: '/repair?service=camera-repair'
  },
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    title: 'Flagship 5G Handsets',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    title: 'Logic Board Diagnostics',
    href: '/repair?service=software-system-fix'
  },
  {
    image: 'https://images.unsplash.com/photo-1533228801758-7621477835a6?w=800&auto=format&fit=crop&q=80',
    title: 'Curated Smartphone Series',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    title: 'Express 45-Min Screen Fix',
    href: '/repair?service=screen-replacement'
  },
  {
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop&q=80',
    title: 'Apple & Android Lineup',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    title: 'OEM Precision Tooling',
    href: '/repair'
  },
  {
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    title: 'Microscope Hardware Bench',
    href: '/repair'
  },
  {
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    title: 'Certified Sealed Devices',
    href: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    title: 'Complete Device Overhaul',
    href: '/repair'
  }
];

export function HomeHero() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`w-full relative overflow-hidden ${isDark ? 'bg-[#09090b]' : 'bg-white'}`}
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 72px)',
        position: 'relative'
      }}
    >
      {/* Background DriftWall Layer with alternating scrolling columns */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
        <DriftWall
          items={HERO_WALL_ITEMS}
          columns={6}
          tileWidth={220}
          tileHeight={144}
          gap={16}
          radius={12}
          tilt={0}
          turn={0}
          roll={0}
          perspective={1000}
          depth={0}
          speed={32}
          direction="down"
          variance={0.3}
          parallax={0.3}
          pauseOnHover={true}
          lift={44}
          fade={0.25}
          dim={isDark ? 0.82 : 0.95}
          overlayColor={isDark ? "#09090b" : "#ffffff"}
          className="w-full h-full"
        />
      </div>

      {/* Atmospheric gradients */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 to-[#09090b]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/40 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 to-white/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 pointer-events-none" />
        </>
      )}

      {/* Hero Content Overlay centered within max-w-7xl */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-12 lg:py-20 flex items-center min-h-[calc(100vh-72px)] pointer-events-none">
        <div className="max-w-2xl space-y-6 pointer-events-auto">
          {isDark ? (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
              Next-Gen Smartphones. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Precision Repairs.
              </span>
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.08]">
              Next-Gen Smartphones. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600">
                Precision Repairs.
              </span>
            </h1>
          )}

          {isDark ? (
            <p className="text-zinc-300/90 text-base sm:text-lg max-w-lg leading-relaxed drop-shadow-sm font-medium">
              Explore the newest flagship phones and genuine accessories with direct warranty, or book fast 45-minute certified doorstep repairs.
            </p>
          ) : (
            <p className="text-zinc-850 text-base sm:text-lg max-w-lg leading-relaxed font-semibold text-zinc-800">
              Explore the newest flagship phones and genuine accessories with direct warranty, or book fast 45-minute certified doorstep repairs.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {isDark ? (
              <>
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-sm rounded-xl shadow-xl shadow-black/50 active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" /> Shop Phones <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/repair"
                  className="px-7 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md border border-zinc-700 hover:border-zinc-500 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-zinc-300" /> Book Repair
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/shop"
                  className="hero-btn-primary px-7 py-3.5 bg-zinc-950 text-white hover:bg-zinc-800 font-extrabold text-sm rounded-xl shadow-xl shadow-zinc-950/20 active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" /> Shop Phones <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/repair"
                  className="hero-btn-secondary px-7 py-3.5 bg-white text-zinc-950 border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-zinc-700" /> Book Repair
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeHero;
