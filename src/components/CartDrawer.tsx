'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [orderCompleteData, setOrderCompleteData] = useState<{ orderId: string; total: number } | null>(null);

  const shippingCost = subtotal > 499 || subtotal === 0 ? 0 : 99;
  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = Math.round((subtotal * appliedDiscount.percent) / 100);
    } else if (appliedDiscount.amount) {
      discountAmount = Math.min(subtotal, appliedDiscount.amount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code: 'WELCOME10', percent: 10 });
    } else if (code === 'FLAT500') {
      setAppliedDiscount({ code: 'FLAT500', amount: 500 });
    } else if (code === 'LSMOBILE') {
      setAppliedDiscount({ code: 'LSMOBILE', percent: 15 });
    } else {
      setCouponError('Invalid coupon. Try: WELCOME10, LSMOBILE, or FLAT500');
    }
  };

  const handleDemoCheckout = () => {
    const generatedOrderId = `LS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCompleteData({
      orderId: generatedOrderId,
      total: finalTotal,
    });
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const handleCloseAll = () => {
    if (orderCompleteData) {
      clearCart();
      setOrderCompleteData(null);
    }
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleCloseAll}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 text-white shadow-2xl flex flex-col justify-between border-l border-zinc-800">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">
                Your Bag ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCloseAll}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping indicator bar */}
          <div className="px-5 py-3 bg-zinc-950/80 border-b border-zinc-800 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-white" />
                You qualified for <span className="underline">FREE Standard Delivery</span>!
              </p>
            ) : (
              <div>
                <p className="text-zinc-300">
                  Add <span className="font-bold text-white">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</span> more to get <span className="font-bold">FREE Delivery</span>
                </p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-800">
            {orderCompleteData ? (
              /* Order Confirmation Screen */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 text-white border border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-white">Demo Order Placed!</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Thank you! Your simulated test order has been received. No real charges were processed.
                </p>
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-left text-xs space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Order ID:</span>
                    <span className="font-mono font-bold text-white">{orderCompleteData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="font-bold text-white">₹{orderCompleteData.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment:</span>
                    <span className="font-medium text-zinc-300">Demo Cash on Delivery / UPI</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseAll}
                  className="w-full mt-4 py-3 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl font-black text-sm transition-colors shadow-lg shadow-black/40"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart State */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto border border-zinc-700">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Your bag is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Explore smartphones, accessories, or book genuine device repairs.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black rounded-xl transition-colors shadow-lg shadow-black/40"
                >
                  Browse Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              /* Cart Item List */
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-20 h-20 bg-zinc-950 rounded-xl p-2 border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-bold text-white text-sm hover:text-zinc-300 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-400 hover:text-rose-400 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {item.selectedColor}
                          {item.selectedStorage ? ` · ${item.selectedStorage}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-950">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300 rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300 rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-black text-sm text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {!orderCompleteData && cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-3">
              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon: WELCOME10"
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs uppercase placeholder:normal-case text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
              {appliedDiscount && (
                <p className="text-[11px] text-zinc-300 font-semibold flex items-center justify-between">
                  <span>Coupon {appliedDiscount.code} applied!</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </p>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-white font-semibold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span>{shippingCost === 0 ? <span className="text-white font-semibold">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total (Demo)</span>
                  <span className="text-white">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Demo Notice */}
              <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-300" />
                Demo checkout · No real payment required
              </p>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleDemoCheckout}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-black/50 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout (Demo) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CartDrawer;
