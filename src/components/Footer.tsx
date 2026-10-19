'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-20">
      {/* Trust USP Bar above footer */}
      <div className="bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Genuine</h4>
                <p className="text-xs text-zinc-400">Direct brand warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Delivery</h4>
                <p className="text-xs text-zinc-400">On orders above ₹499</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Easy Returns</h4>
                <p className="text-xs text-zinc-400">7-day replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Expert Support</h4>
                <p className="text-xs text-zinc-400">Call & chat assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">LS</span>
                <span className="text-2xl font-extrabold tracking-tight text-zinc-300">MOBILES</span>
              </div>
              <span className="text-[9px] font-semibold tracking-[0.24em] text-zinc-500 uppercase block">
                Care. Connect. Complete.
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Your trusted partner for latest smartphones, authentic mobile accessories, and certified professional device repairs with genuine parts and transparent pricing.
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-300" />
                <span>104, Tech Plaza, Commercial Complex, Bengaluru, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-300" />
                <span>+91 80 4920 1800 (Mon - Sat, 9 AM - 8 PM)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-300" />
                <span>support@lsmobiles.in</span>
              </p>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop?category=smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tablets" className="hover:text-white transition-colors">
                  Tablets & iPads
                </Link>
              </li>
              <li>
                <Link href="/shop?category=smart-watches" className="hover:text-white transition-colors">
                  Smart Watches
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earbuds" className="hover:text-white transition-colors">
                  Wireless Earbuds
                </Link>
              </li>
              <li>
                <Link href="/shop?category=power-banks" className="hover:text-white transition-colors">
                  Power Banks & MagSafe
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-white transition-colors">
                  Chargers & Cables
                </Link>
              </li>
            </ul>
          </div>

          {/* Repair Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Certified Repairs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/repair?service=screen-replacement" className="hover:text-white transition-colors">
                  Screen Glass Replacement
                </Link>
              </li>
              <li>
                <Link href="/repair?service=battery-replacement" className="hover:text-white transition-colors">
                  Battery Swap & Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/repair?service=water-damage" className="hover:text-white transition-colors">
                  Liquid & Water Damage Fix
                </Link>
              </li>
              <li>
                <Link href="/repair?service=software-system-fix" className="hover:text-white transition-colors">
                  OS & Motherboard Repair
                </Link>
              </li>
              <li>
                <Link href="/repair?service=camera-repair" className="hover:text-white transition-colors">
                  Camera Lens Calibration
                </Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-white transition-colors font-medium text-zinc-300">
                  Track Existing Ticket →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About LS Mobiles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Store Locator & Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-zinc-300 font-semibold">
                  Admin Database Portal
                </Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-white transition-colors">
                  Doorstep Service Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} LS Mobiles India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white">Terms of Sale</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white">Privacy Policy</Link>
            <span>·</span>
            <Link href="/repair" className="hover:text-white">Repair Warranty</Link>
            <span>·</span>
            <Link href="/admin" className="hover:text-white">SQLite Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
