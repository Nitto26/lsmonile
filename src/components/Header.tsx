'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Smartphone,
  Wrench,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import GlassSurface from './GlassSurface';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, wishlist, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    setMounted(true);
    fetch('/api/repairs')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.services)) {
          setLiveServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileSearchOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Repair', href: '/repair' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    return {
      products: [] as Product[],
      repairs: liveServices.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, liveServices]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-none shadow-none">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={0}
          displace={0.3}
          distortionScale={-80}
          blur={14}
          backgroundOpacity={0.15}
          saturation={1.1}
          style={{
            overflow: 'visible',
            backgroundColor: isDark ? 'rgba(9, 9, 11, 0.85)' : 'rgba(255, 255, 255, 0.88)',
            borderBottom: 'none',
            boxShadow: 'none',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 w-full">
            <div className="flex items-center justify-between h-16 md:h-20 gap-4 mobile-topbar">
              {/* Brand Logo & Name (Top Bar in all views) */}
              <Link href="/" className="flex flex-col group flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-105">
                    LS
                  </span>
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-300">
                    MOBILES
                  </span>
                </div>
                <span className="text-[8px] md:text-[9px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
                  Care. Connect. Complete.
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 xl:space-x-2">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative px-3.5 py-2 text-sm font-semibold transition-all duration-150 rounded-xl ${
                        isActive
                          ? 'text-white font-bold bg-zinc-800/90 shadow-xs border border-zinc-700'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Search Bar */}
              <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="Search products, services, parts..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-900 focus:bg-zinc-900 text-sm text-white placeholder:text-zinc-500 rounded-full border border-zinc-700 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 shadow-inner backdrop-blur-md transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 text-zinc-400 hover:text-white text-xs bg-zinc-800 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </form>

                {/* Instant Search Results Dropdown */}
                {isSearchOpen && searchResults && (searchResults.products.length > 0 || searchResults.repairs.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {searchResults.products.length > 0 && (
                      <div className="p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
                          Products ({searchResults.products.length})
                        </p>
                        <div className="space-y-1">
                          {searchResults.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                                  <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h4>
                                  <span className="text-xs text-zinc-400">{product.brand} · {product.categoryLabel}</span>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.repairs.length > 0 && (
                      <div className="p-3 border-t border-zinc-800 bg-zinc-950/60">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
                          Repair Services
                        </p>
                        <div className="space-y-1">
                          {searchResults.repairs.map((repair) => (
                            <Link
                              key={repair.id}
                              href={`/repair?service=${repair.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-semibold text-white">{repair.title}</p>
                                <p className="text-xs text-zinc-400">{repair.description} · {repair.turnaroundTime}</p>
                              </div>
                              <span className="text-xs font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">
                                From ₹{repair.priceFrom.toLocaleString('en-IN')}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 bg-zinc-950 border-t border-zinc-800 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline cursor-pointer"
                      >
                        View all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Right Action Icons */}
              <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
                <AnimatedThemeToggler
                  className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center"
                  variant="circle"
                  duration={450}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle light or dark theme"
                />

                <Link
                  href="/shop?filter=wishlist"
                  className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {mounted && wishlist.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  title="Shopping Cart"
                  aria-label="View Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-zinc-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-zinc-900 shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(true)}
                  className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  title="User Account"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Right: ONLY Theme Toggle Icon */}
              <div className="flex md:hidden items-center">
                <AnimatedThemeToggler
                  className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                  variant="circle"
                  duration={450}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle light or dark theme"
                />
              </div>
            </div>
          </div>
        </GlassSurface>
      </header>

      {/* Mobile Bottom Task Bar (Fixed Dock for all other navigation items) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="mobile-taskbar fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
        }}
      >
        <div className="grid grid-cols-6 h-16 items-center px-3 sm:px-4 max-w-lg mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            className={`taskbar-item flex flex-col items-center justify-center py-1 transition-all ${
              pathname === '/' ? 'active' : ''
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Home className="w-5 h-5" />
              {pathname === '/' && (
                <span className="active-dot absolute -bottom-1.5 w-1 h-1 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
          </Link>

          {/* 2. Shop */}
          <Link
            href="/shop"
            className={`taskbar-item flex flex-col items-center justify-center py-1 transition-all ${
              pathname.startsWith('/shop') && !pathname.includes('wishlist') ? 'active' : ''
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
              {pathname.startsWith('/shop') && !pathname.includes('wishlist') && (
                <span className="active-dot absolute -bottom-1.5 w-1 h-1 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Shop</span>
          </Link>

          {/* 3. Repair */}
          <Link
            href="/repair"
            className={`taskbar-item flex flex-col items-center justify-center py-1 transition-all ${
              pathname.startsWith('/repair') ? 'active' : ''
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Wrench className="w-5 h-5" />
              {pathname.startsWith('/repair') && (
                <span className="active-dot absolute -bottom-1.5 w-1 h-1 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Repair</span>
          </Link>

          {/* 4. Search */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className={`taskbar-item flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
              isMobileSearchOpen ? 'active' : ''
            }`}
            aria-label="Search store"
          >
            <div className="relative flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Search</span>
          </button>

          {/* 5. Wishlist */}
          <Link
            href="/shop?filter=wishlist"
            className={`taskbar-item flex flex-col items-center justify-center py-1 transition-all relative ${
              pathname.includes('wishlist') ? 'active' : ''
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Heart className="w-5 h-5" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-950" />
              )}
              {pathname.includes('wishlist') && (
                <span className="active-dot absolute -bottom-1.5 w-1 h-1 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Wishlist</span>
          </Link>

          {/* 6. Cart */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="taskbar-item flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer"
            aria-label="View shopping cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="taskbar-badge absolute -top-1.5 -right-2.5 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-1">Cart</span>
          </button>
        </div>
      </nav>

      {/* Mobile Search Modal / Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md animate-in fade-in duration-150 md:hidden">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Search LS Mobiles</span>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, repairs, accessories..."
                className="w-full pl-9 pr-9 py-2.5 bg-zinc-950 text-white placeholder:text-zinc-500 rounded-xl border border-zinc-700 focus:outline-none focus:border-white text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white text-xs bg-zinc-800 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
            </form>
          </div>

          {/* Results or Quick Links in Mobile Search */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {searchResults && (searchResults.products.length > 0 || searchResults.repairs.length > 0) ? (
              <div className="space-y-4">
                {searchResults.products.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Products ({searchResults.products.length})
                    </p>
                    <div className="space-y-1.5">
                      {searchResults.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={() => {
                            setIsMobileSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-800">
                              <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h4>
                              <span className="text-xs text-zinc-400">{product.brand} · ₹{product.price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.repairs.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Repair Services
                    </p>
                    <div className="space-y-1.5">
                      {searchResults.repairs.map((repair) => (
                        <Link
                          key={repair.id}
                          href={`/repair?service=${repair.id}`}
                          onClick={() => {
                            setIsMobileSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{repair.title}</p>
                            <p className="text-xs text-zinc-400">From ₹{repair.priceFrom.toLocaleString('en-IN')} · {repair.turnaroundTime}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2.5 bg-white text-zinc-950 font-bold text-xs rounded-xl text-center shadow-sm cursor-pointer"
                >
                  View all results for &quot;{searchQuery}&quot;
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quick Navigation</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/about"
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white border border-zinc-800 text-center"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white border border-zinc-800 text-center"
                  >
                    Contact
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setIsUserModalOpen(true);
                    }}
                    className="col-span-2 p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white border border-zinc-800 text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-zinc-400" /> Demo Account & Repairs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo User Account Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900/95 backdrop-blur-2xl rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-700 relative text-white">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-white/10">
                LS
              </div>
              <div>
                <h3 className="font-bold text-white">Demo Customer</h3>
                <p className="text-xs text-zinc-400">demo.user@lsmobiles.in</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Demo Member Tier</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" /> LS Platinum
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Saved Wishlist Items</span>
                <span className="font-semibold text-white">{wishlist.length} item(s)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Active Repair Tickets</span>
                <span className="font-semibold text-white">1 In Progress</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Link
                  href="/repair?track=LS-REP-8492"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl text-center transition-colors border border-zinc-800"
                >
                  Track Repair
                </Link>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 py-2 px-3 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black rounded-xl text-center transition-colors shadow-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
