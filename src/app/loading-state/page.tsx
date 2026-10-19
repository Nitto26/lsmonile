'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ArrowLeft, RefreshCw, ShoppingCart, Wrench, Sparkles } from 'lucide-react';

export default function LoadingStateDemoPage() {
  const [activeScenario, setActiveScenario] = useState<{
    id: string;
    title: string;
    subtitle: string;
  }>({
    id: 'figma-default',
    title: 'Finding the right device...',
    subtitle: 'Preparing your shopping experience...',
  });

  const [key, setKey] = useState(0);

  const scenarios = [
    {
      id: 'figma-default',
      name: 'Figma Screen 5 (Default)',
      title: 'Finding the right device...',
      subtitle: 'Preparing your shopping experience...',
      icon: Sparkles,
    },
    {
      id: 'shop-loading',
      name: 'Catalog Filtering State',
      title: 'Updating product catalog...',
      subtitle: 'Filtering smartphones and genuine accessories...',
      icon: ShoppingCart,
    },
    {
      id: 'repair-diagnostics',
      name: 'Repair Diagnostics State',
      title: 'Analyzing device specifications...',
      subtitle: 'Checking genuine spare part inventory & turnaround...',
      icon: Wrench,
    },
  ];

  const handleSelectScenario = (sc: typeof scenarios[0]) => {
    setActiveScenario(sc);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Screen 05 Reference
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            05 — Loading / Interaction State
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Matching Figma Screen 5 concentric pulse animations, progress loaders, and feedback transitions.
          </p>
        </div>

        {/* Interactive Scenario Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Replay Loader
          </button>
        </div>
      </div>

      {/* Screen 5 Exact Component */}
      <div className="bg-slate-100/50 rounded-3xl p-4 sm:p-8 border border-slate-200">
        <LoadingScreen
          key={key}
          title={activeScenario.title}
          subtitle={activeScenario.subtitle}
          duration={3000}
        />
      </div>

      {/* Interactive Testing Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          Interactive State Scenarios
        </h3>
        <p className="text-xs text-slate-500">
          Switch between states to see how the loading and interaction feedback operates throughout the website.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isCurrent = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                    {sc.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{sc.title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
