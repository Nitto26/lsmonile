import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Wrench, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="bg-zinc-900/60 rounded-3xl p-8 sm:p-14 border border-zinc-800 text-center max-w-4xl mx-auto space-y-4 text-white shadow-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
          About LS Mobiles
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Care. Connect. Complete.
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Founded with a commitment to providing transparent pricing, certified mobile repairs, and 100% authentic tech devices without middleman markups.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 bg-zinc-800 text-white rounded-2xl flex items-center justify-center border border-zinc-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% OEM Authenticity</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every smartphone, charger, and cable in our catalog is sourced straight from official distributors with full manufacturer warranty.
          </p>
        </div>

        <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 bg-zinc-800 text-white rounded-2xl flex items-center justify-center border border-zinc-700">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Certified Technicians</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our repair team holds Level-4 micro-soldering and ESD-safe certifications, ensuring flawless screen, battery, and motherboard repairs.
          </p>
        </div>

        <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 bg-zinc-800 text-white rounded-2xl flex items-center justify-center border border-zinc-700">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">90-Day Peace of Mind</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All replaced parts come backed with a complimentary 90-day warranty. If any defect arises, we repair or replace it free.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-zinc-800 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold">Have a broken device?</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Book an instant doorstep pickup or visit our service center.
          </p>
        </div>
        <Link
          href="/repair"
          className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-black/40 flex items-center gap-2 flex-shrink-0"
        >
          Book Repair <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
