'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/SkeletonLoader';
import { useCart } from '@/context/CartContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');
  const filterParam = searchParams.get('filter');
  const { wishlist } = useCart();

  // Products from SQLite database
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch all products from SQLite API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products from SQLite', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Sync category param from URL if it changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedTypes([categoryParam]);
    }
  }, [categoryParam]);

  // Extract dynamic brands from actual database products
  const dynamicBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  const productTypes = [
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'tablets', label: 'Tablets' },
    { id: 'smart-watches', label: 'Smart watches' },
    { id: 'earbuds', label: 'Earbuds & Headsets' },
    { id: 'power-banks', label: 'Power banks' },
    { id: 'chargers', label: 'Chargers' },
    { id: 'accessories', label: 'Accessories' },
  ];

  // Filtering Logic on live SQLite data
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query param
        if (queryParam) {
          const q = queryParam.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Wishlist filter
        if (filterParam === 'wishlist') {
          if (!wishlist.includes(p.id)) return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Category / Product type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(p.category)) {
          return false;
        }

        // Price filter
        if (p.price > maxPrice) {
          return false;
        }

        // Rating filter
        if (minRating !== null && p.rating < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default newest
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      });
  }, [products, queryParam, filterParam, wishlist, selectedBrands, selectedTypes, maxPrice, minRating, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setMaxPrice(150000);
    setMinRating(null);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedTypes.length > 0 ||
    maxPrice < 150000 ||
    minRating !== null;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-6 space-y-6 text-zinc-950 dark:text-white">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-zinc-500 gap-1.5">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-white font-semibold">Shop</span>
        {queryParam && (
          <>
            <span>/</span>
            <span className="text-zinc-300">Search: &quot;{queryParam}&quot;</span>
          </>
        )}
      </nav>

      {/* Header and Promo Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              SQLite Connected
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Latest Tech
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Smartphones, accessories and genuine components loaded directly from SQLite database.
          </p>
        </div>

        {/* Top Right Arrival Banner */}
        <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-white">Upgrade your world.</h4>
            <p className="text-xs text-zinc-400">New arrivals. Better prices.</p>
          </div>
          <button
            onClick={() => {
              handleClearAll();
              setSortBy('newest');
            }}
            className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs rounded-xl shadow-xs transition-colors flex-shrink-0 cursor-pointer"
          >
            Shop New Arrivals
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-2">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
            Filters {hasActiveFilters && `(${selectedBrands.length + selectedTypes.length})`}
          </button>

          {/* Sort dropdown mobile */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-2 font-semibold text-white focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`lg:col-span-3 bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 space-y-6 shadow-xl ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="font-extrabold text-white text-base">Filters</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-zinc-400 hover:text-white hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Price range
            </label>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
              <span>₹0</span>
              <span className="text-white font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="150000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Brand Filter Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Brand
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dynamicBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 rounded text-white bg-zinc-950 border-zinc-700 focus:ring-white cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Type Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Product type
            </label>
            <div className="space-y-2">
              {productTypes.map((pt) => (
                <label
                  key={pt.id}
                  className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(pt.id)}
                    onChange={() => toggleType(pt.id)}
                    className="w-4 h-4 rounded text-white bg-zinc-950 border-zinc-700 focus:ring-white cursor-pointer"
                  />
                  <span>{pt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Customer rating
            </label>
            <div className="space-y-1.5 text-xs">
              {[4.5, 4.0, 3.5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(minRating === rating ? null : rating)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    minRating === rating
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'hover:bg-zinc-800/50 text-zinc-400'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-zinc-300 text-zinc-300" />
                    <span>{rating}★ & above</span>
                  </span>
                  {minRating === rating && <span className="text-xs font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Section: Product Counter & Grid */}
        <section className="lg:col-span-9 space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              All Products ({filteredProducts.length})
            </h2>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:flex items-center gap-2">
              <label htmlFor="desktop-sort" className="text-xs text-zinc-400 font-medium">Sort by:</label>
              <div className="relative">
                <select
                  id="desktop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white rounded-xl px-3.5 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer shadow-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Active:</span>
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-zinc-700 cursor-pointer"
                >
                  {b} <X className="w-3 h-3" />
                </button>
              ))}
              {selectedTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-zinc-700 cursor-pointer"
                >
                  {t} <X className="w-3 h-3" />
                </button>
              ))}
              {maxPrice < 150000 && (
                <button
                  onClick={() => setMaxPrice(150000)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-zinc-700 cursor-pointer"
                >
                  Under ₹{maxPrice.toLocaleString('en-IN')} <X className="w-3 h-3" />
                </button>
              )}
              {minRating !== null && (
                <button
                  onClick={() => setMinRating(null)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-zinc-700 cursor-pointer"
                >
                  {minRating}★ & above <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Product Grid / Skeleton */}
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800 p-12 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto border border-zinc-700">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No matching products found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try loosening your filters, adjusting the price slider, or clearing the search query.
              </p>
              <button
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-zinc-500">Loading catalog from database...</div>}>
      <ShopContent />
    </Suspense>
  );
}
