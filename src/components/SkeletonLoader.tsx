import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="h-5 w-12 bg-slate-200 rounded-full" />
        <div className="h-7 w-7 bg-slate-200 rounded-full" />
      </div>
      <div className="h-44 bg-slate-100 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded-md w-1/3 mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-20 bg-slate-200 rounded-md" />
        <div className="h-4 w-12 bg-slate-200 rounded-md" />
      </div>
      <div className="h-10 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
