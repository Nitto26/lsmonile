'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, Activity } from 'lucide-react';

export function DemoDisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-semibold text-white">
            Interactive Figma Prototype
          </span>
          <span className="text-zinc-400 hidden sm:inline">
            — Simulated cart, orders & repairs. No real payment required.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-[11px] font-semibold text-zinc-300 hover:text-white underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-white" /> SQLite Admin Dashboard
          </Link>
          <span className="text-zinc-700">|</span>
          <Link
            href="/loading-state"
            className="text-[11px] font-medium text-zinc-400 hover:text-white underline flex items-center gap-1"
          >
            <Activity className="w-3 h-3" /> View Figma Loading State
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-500 hover:text-white p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
