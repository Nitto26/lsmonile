'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  RotateCcw,
  CreditCard,
  Truck,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Sparkles,
  Package,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const { addToCart, setIsCartOpen, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Dynamic customization state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions ? product.storageOptions[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'reviews' | 'faqs'>('overview');
  
  // Pincode availability checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Price adjustment based on storage tier
  let adjustedPrice = product.price;
  let adjustedOriginalPrice = product.originalPrice;
  if (selectedStorage === '256GB') {
    adjustedPrice += 10000;
    adjustedOriginalPrice += 10000;
  } else if (selectedStorage === '512GB') {
    adjustedPrice += 30000;
    adjustedOriginalPrice += 30000;
  }

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus(`Available! Free delivery to ${pincode} by tomorrow.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedStorage, quantity);
    setIsCartOpen(true);
  };

  const currentPreviewImage =
    product.galleryImages && product.galleryImages[activeImageIndex]
      ? product.galleryImages[activeImageIndex]
      : product.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 text-white">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-zinc-500 gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-white">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery Column (left) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnail Strip */}
          <div className="flex sm:flex-col gap-3 justify-center sm:justify-start">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 border-2 transition-all cursor-pointer bg-zinc-950 flex items-center justify-center ${
                  activeImageIndex === idx
                    ? 'border-white shadow-md ring-2 ring-white/20'
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>

          {/* Large Main Preview Card */}
          <div className="flex-1 bg-zinc-900/60 rounded-3xl border border-zinc-800 p-8 sm:p-12 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-2xl">
            <img
              src={currentPreviewImage}
              alt={product.name}
              className="max-h-[360px] max-w-full object-contain drop-shadow-2xl transition-all duration-300"
            />

            {/* Indicator badge */}
            <span className="absolute bottom-4 right-5 text-xs font-mono font-semibold text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 rounded-full shadow-xs">
              0{activeImageIndex + 1} / 0{product.galleryImages.length}
            </span>
          </div>
        </div>

        {/* Product Info Column (right) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Tag / Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-950 bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                BESTSELLER • {product.discount}% OFF
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isWishlisted ? 'text-rose-400 bg-rose-500/20' : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Title & Brand */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {product.brand} · {selectedStorage || product.categoryLabel} · {selectedColor}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-zinc-300">
                <Star className="w-4 h-4 fill-zinc-300 text-zinc-300" />
              </div>
              <span className="text-sm font-bold text-white">{product.rating}</span>
              <span className="text-xs text-zinc-500">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                ₹{adjustedPrice.toLocaleString('en-IN')}
              </span>
              {adjustedOriginalPrice > adjustedPrice && (
                <span className="text-base text-zinc-500 line-through">
                  ₹{adjustedOriginalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Color: <span className="font-semibold text-zinc-300">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'border-white ring-2 ring-white/30 scale-110'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-4 h-4 ${color.hex === '#FFFFFF' || color.hex === '#F8FAFC' || color.hex === '#E2E8F0' ? 'text-zinc-950' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Options Buttons */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Storage
              </label>
              <div className="grid grid-cols-3 gap-3">
                {product.storageOptions.map((storage) => (
                  <button
                    key={storage}
                    type="button"
                    onClick={() => setSelectedStorage(storage)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      selectedStorage === storage
                        ? 'border-white bg-zinc-800 text-white shadow-xs'
                        : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 bg-zinc-950'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Free Delivery & Pincode Checker */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Truck className="w-4 h-4 text-white" />
              <span>Free delivery · Orders above ₹499</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter PIN Code"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`text-xs ${pincodeStatus.startsWith('Available') ? 'text-white font-semibold' : 'text-rose-400'}`}>
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-700 rounded-xl bg-zinc-950 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Primary Button */}
              <button
                type="button"
                onClick={() => addToCart(product, selectedColor, selectedStorage, quantity)}
                className="flex-1 py-3.5 px-6 bg-white hover:bg-zinc-200 active:scale-[0.99] text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Secondary Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Guarantees under buttons */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-800">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-white" /> Genuine products
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-white" /> Easy returns
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-white" /> Secure payment
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="bg-zinc-900/60 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-xl">
        {/* Tab Headers */}
        <div className="flex items-center gap-4 sm:gap-8 border-b border-zinc-800 overflow-x-auto pb-px">
          {(
            [
              { key: 'overview', label: 'Overview' },
              { key: 'specs', label: 'Specifications' },
              { key: 'box', label: 'In the Box' },
              { key: 'reviews', label: `Reviews (${product.reviewCount})` },
              { key: 'faqs', label: 'FAQs' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base max-w-3xl">
                {product.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {product.overviewHighlights.map((hl, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <Sparkles className="w-5 h-5 text-white mb-2" />
                    <h4 className="text-sm font-bold text-white">{hl.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{hl.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="divide-y divide-zinc-800 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-semibold text-zinc-500">{key}</span>
                  <span className="sm:col-span-2 text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'box' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Items included in retail packaging:</h4>
              <ul className="space-y-2">
                {product.inTheBox.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Package className="w-4 h-4 text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-center">
                  <span className="text-4xl font-black text-white">{product.rating}</span>
                  <div className="flex text-zinc-300 justify-center mt-1">
                    <Star className="w-4 h-4 fill-zinc-300 text-zinc-300" />
                  </div>
                  <span className="text-xs text-zinc-500 mt-1 block">Out of 5 Stars</span>
                </div>
                <div className="border-l border-zinc-800 pl-6 space-y-1 text-xs text-zinc-400">
                  <p>• 94% of customers recommended this product</p>
                  <p>• Verified buyer reviews synced</p>
                  <p>• Tested authentic OEM hardware</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-4">
              {[
                { q: 'Is this device covered under official brand warranty?', a: 'Yes, 100% genuine sealed unit backed by 1-year official brand manufacturer warranty.' },
                { q: 'What is the return and replacement policy?', a: 'We offer a 7-day hassle-free replacement guarantee if the product arrives defective or damaged.' },
                { q: 'Does LS Mobiles offer express doorstep delivery?', a: 'Yes, orders confirmed before 3 PM in metro areas are delivered with same-day or next-day express delivery.' },
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5 pt-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Similar Tech You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default ProductDetailClient;
