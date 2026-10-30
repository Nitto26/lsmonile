'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, cart } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;
  const inCartItem = mounted ? cart.find((i) => i.productId === product.id) : undefined;

  return (
    <div className="group relative bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800/80 hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/60 p-4 transition-all duration-200 flex flex-col justify-between text-white">
      {/* Top row: Badges and Wishlist button */}
      <div className="flex items-center justify-between z-10">
        <div>
          {product.isNew ? (
            <span className="bg-white text-zinc-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              NEW
            </span>
          ) : product.isBestseller ? (
            <span className="bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              BESTSELLER
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-zinc-400">
              {product.brand}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isWishlisted
              ? 'text-rose-400 bg-rose-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image preview container matching Figma */}
      <Link
        href={`/product/${product.id}`}
        className="block my-3 py-6 px-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl overflow-hidden text-center relative group-hover:bg-zinc-950/90 group-hover:border-zinc-700 transition-all"
      >
        <div className="w-full h-44 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
            loading="lazy"
            decoding="async"
            width={176}
            height={176}
          />
        </div>
      </Link>

      {/* Product details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-zinc-300 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 mt-0.5">{product.categoryLabel}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-zinc-300 text-zinc-300" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">{product.rating}</span>
            <span className="text-xs text-zinc-500">({product.reviewCount})</span>
          </div>

          {/* Price row matching Figma */}
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-black text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-zinc-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded-md">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* CTA Button matching Figma */}
        <div className="mt-4 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] ${
              inCartItem
                ? 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                : 'bg-white hover:bg-zinc-200 text-zinc-950 shadow-black/40'
            }`}
          >
            {inCartItem ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>In Cart ({inCartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
