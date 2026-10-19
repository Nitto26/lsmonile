'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Database,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import GlassSurface from './GlassSurface';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, wishlist, setIsCartOpen } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);

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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Repair', href: '/repair' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/admin' },
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
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between h-20 gap-4">
              {/* Brand Logo */}
              <Link href="/" className="flex flex-col group flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-105">
                    LS
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-zinc-300">
                    MOBILES
                  </span>
                </div>
                <span className="text-[9px] font-semibold tracking-[0.24em] text-zinc-400 uppercase">
                  Care. Connect. Complete.
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
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

              {/* Pill Search Bar with Glassmorphism */}
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
                        className="absolute right-3.5 text-zinc-400 hover:text-white text-xs bg-zinc-800 rounded-full w-4 h-4 flex items-center justify-center"
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
                        className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline"
                      >
                        View all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Action Icons matching Monochromatic Theme */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Theme Toggler with View Transition Animation */}
                <AnimatedThemeToggler
                  className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center"
                  variant="circle"
                  duration={450}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle light or dark theme"
                />

                {/* Wishlist Link */}
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

                {/* Shopping Cart Button */}
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

                {/* User Profile Icon */}
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(true)}
                  className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  title="User Account"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Mobile menu toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 backdrop-blur-md rounded-xl transition-all ml-1 cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar with Glassmorphism */}
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, services, parts..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 backdrop-blur-md text-sm text-white placeholder:text-zinc-500 rounded-full border border-zinc-700 focus:outline-none focus:border-white shadow-inner"
                />
              </form>
            </div>
          </div>

          {/* Mobile Navigation Drawer with Glassmorphism */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 shadow-2xl animate-in fade-in duration-150">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        isActive
                          ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                          : 'text-zinc-300 hover:bg-zinc-800/60'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Certified LS Technicians</span>
                </div>
                <Link
                  href="/repair"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 border border-white px-3 py-1.5 rounded-full shadow-2xs"
                >
                  Book Repair
                </Link>
              </div>
            </div>
          )}
        </GlassSurface>
      </header>

      {/* Demo User Account Modal with Glassmorphism */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900/95 backdrop-blur-2xl rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-700 relative text-white">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
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
              <Link
                href="/admin"
                onClick={() => setIsUserModalOpen(false)}
                className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 border border-zinc-700"
              >
                <Database className="w-3.5 h-3.5" /> SQLite Admin Dashboard
              </Link>
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
                  className="flex-1 py-2 px-3 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black rounded-xl text-center transition-colors shadow-sm"
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
