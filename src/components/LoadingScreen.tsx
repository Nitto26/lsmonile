'use client';

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({
  title = 'Finding the right device...',
  subtitle = 'Preparing your shopping experience...',
  onComplete,
  duration = 2400,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const intervalTime = duration / 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 300);
          }
          return 100;
        }
        // Realistic easing progress
        const remaining = 100 - prev;
        const jump = Math.max(1, Math.min(8, remaining * 0.12));
        return Math.min(100, prev + jump);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      {/* Exact card layout matching Figma Screen 5 */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
        {/* Concentric pulsing blue rings */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          {/* Outermost pulsing ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200/50 animate-ping opacity-60" />
          
          {/* Middle rotating dashed / gradient ring */}
          <div className="absolute inset-1 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />

          {/* Inner solid blue circle with white center */}
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="w-5 h-5 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Text matching Figma */}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          {subtitle}
        </p>

        {/* Progress Bar matching Figma */}
        <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden relative mb-4">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 font-medium">
          This usually takes only a few seconds
        </p>
      </div>
    </div>
  );
}
