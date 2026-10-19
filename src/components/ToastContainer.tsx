'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200 text-white"
        >
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Info className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white">{toast.title}</h4>
            <p className="text-xs text-zinc-400 mt-0.5 break-words">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-white p-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
