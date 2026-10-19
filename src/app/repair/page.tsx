'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Smartphone,
  Battery,
  Droplet,
  Cpu,
  Camera,
  Wrench,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { repairBrands, deviceTypes, commonIssues } from '@/data/repairs';
import { RepairBooking, RepairService } from '@/types';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';

function RepairContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');
  const trackParam = searchParams.get('track');
  const { showToast } = useCart();

  // Dynamic services loaded from SQLite database
  const [services, setServices] = useState<RepairService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Booking Wizard Step state: 1 to 4
  const [currentStep, setCurrentStep] = useState(1);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Form State
  const [selectedDeviceType, setSelectedDeviceType] = useState('Smartphone');
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [modelName, setModelName] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('Cracked / Shattered Screen');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deviceNotes, setDeviceNotes] = useState('');

  const [serviceMode, setServiceMode] = useState<'doorstep' | 'store'>('doorstep');
  const [scheduledDate, setScheduledDate] = useState('2026-10-20');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<RepairBooking | null>(null);

  // Tracking state
  const [trackingIdInput, setTrackingIdInput] = useState(trackParam || '');
  const [activeTrackingResult, setActiveTrackingResult] = useState<RepairBooking | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Load services from SQLite API
  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true);
        const res = await fetch('/api/repairs');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
        }
      } catch (err) {
        console.error('Failed to load repair services', err);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, []);

  // Pre-fill issue if url param provided
  useEffect(() => {
    if (serviceParam) {
      const matchMap: Record<string, string> = {
        'screen-replacement': 'Cracked / Shattered Screen',
        'battery-replacement': 'Battery Draining Quickly',
        'water-damage': 'Water or Liquid Ingress',
        'software-system-fix': 'OS Bootloop / Freezing',
        'camera-repair': 'Camera Lens Scratched / Blurry',
      };
      if (matchMap[serviceParam]) {
        setSelectedIssue(matchMap[serviceParam]);
        setCurrentStep(1);
      }
    }
  }, [serviceParam]);

  // Auto track if param provided
  useEffect(() => {
    if (trackParam) {
      handleTrackId(trackParam);
    }
  }, [trackParam]);

  const handleSelectServiceCard = (serviceId: string) => {
    const matchMap: Record<string, string> = {
      'screen-replacement': 'Cracked / Shattered Screen',
      'battery-replacement': 'Battery Draining Quickly',
      'water-damage': 'Water or Liquid Ingress',
      'software-system-fix': 'OS Bootloop / Freezing',
      'camera-repair': 'Camera Lens Scratched / Blurry',
    };
    if (matchMap[serviceId]) {
      setSelectedIssue(matchMap[serviceId]);
    }
    setCurrentStep(1);
    const formElement = document.getElementById('booking-wizard-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!modelName.trim()) {
        showToast('Model Required', 'Please enter your phone or device model name', 'warning');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!customerName.trim() || !customerPhone.trim()) {
        showToast('Contact Required', 'Please provide your name and phone number', 'warning');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleFinalSubmitBooking();
    }
  };

  const handleFinalSubmitBooking = async () => {
    try {
      setSubmittingBooking(true);
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: selectedDeviceType,
          brand: selectedBrand,
          model: modelName,
          issue: selectedIssue,
          customerName,
          customerPhone,
          customerEmail,
          deviceNotes,
          serviceMode,
          scheduledDate,
          timeSlot,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create repair booking');
      }

      const data = await res.json();
      setConfirmedBooking(data.booking);
      showToast('Repair Booked!', `Ticket ${data.booking.id} created successfully!`, 'success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback
      }
    } catch (err: any) {
      showToast('Booking Failed', err.message || 'Please try again', 'warning');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleTrackId = async (idToSearch?: string) => {
    const id = (idToSearch || trackingIdInput).trim();
    if (!id) {
      setTrackingError('Please enter a repair ticket ID');
      return;
    }

    try {
      setTrackingLoading(true);
      setTrackingError('');
      setActiveTrackingResult(null);

      const res = await fetch(`/api/repairs/${encodeURIComponent(id)}`);
      if (res.status === 404) {
        setTrackingError(`No repair ticket found for "${id}". Try a sample ID like LS-REP-8492.`);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch repair status');
      }

      const data = await res.json();
      setActiveTrackingResult(data.booking);
    } catch (err: any) {
      setTrackingError(err.message || 'Error looking up repair ticket');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero Section matching Monochromatic Dark Style */}
      <section className="bg-zinc-900/60 rounded-3xl border border-zinc-800 p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-extrabold tracking-widest text-zinc-300 uppercase bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full">
              EXPERT REPAIR SERVICES
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              We Fix Your Devices. <br />
              <span className="text-zinc-400">Like New Again.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg">
              From minor issues to major repairs, we’ve got you covered. Genuine spare parts & 90-day warranty on all repairs, backed by certified technicians.
            </p>
          </div>

          {/* Hero stylized device graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 h-56 sm:w-80 sm:h-64 bg-zinc-950/80 rounded-3xl p-6 flex items-center justify-center border border-zinc-800 shadow-inner relative">
              <div className="w-32 h-44 bg-zinc-900 rounded-2xl border-2 border-zinc-600 flex flex-col items-center justify-center p-3 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center mb-2 shadow-md">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="w-16 h-2 bg-zinc-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Section: Services Grid + Booking & Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Our Repair Services Grid */}
        <section className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-wider border border-zinc-700">
                SQLite Synced
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Our Repair Services
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Professional repair solutions for major brands and devices. Click any service to book.
            </p>
          </div>

          {/* 6 Services Cards */}
          {servicesLoading ? (
            <div className="p-8 text-center text-zinc-500">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => {
                const iconMap: Record<string, any> = {
                  screen: Smartphone,
                  battery: Battery,
                  water: Droplet,
                  software: Cpu,
                  camera: Camera,
                  other: Wrench,
                };
                const Icon = iconMap[service.iconName] || Wrench;

                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectServiceCard(service.id)}
                    className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between text-white"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-zinc-800 text-white group-hover:bg-white group-hover:text-zinc-950 transition-colors flex items-center justify-center flex-shrink-0 border border-zinc-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-zinc-200 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{service.description}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">
                        From ₹{service.priceFrom.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {service.turnaroundTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" /> 90-Day LS Warranty
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" /> 100% Genuine OEM Parts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" /> No Fix, No Fee Guarantee
            </span>
          </div>
        </section>

        {/* Right Column: Book a Repair Wizard & Track Your Repair */}
        <div id="booking-wizard-card" className="lg:col-span-5 space-y-6">
          {/* Card 1: Book a Repair Card */}
          <div className="bg-zinc-900/70 rounded-3xl border border-zinc-800 p-6 sm:p-7 shadow-xl text-white">
            <div className="mb-5">
              <h3 className="text-lg font-black text-white tracking-tight">
                Book a Repair
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Get your device repaired in 4 easy steps (Saved to SQLite).
              </p>
            </div>

            {/* 4-Step Stepper Header */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
              {[
                { step: 1, label: 'Device & Issue' },
                { step: 2, label: 'Details' },
                { step: 3, label: 'Schedule' },
                { step: 4, label: 'Confirm' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === s.step
                        ? 'bg-white text-zinc-950 shadow-md shadow-white/20'
                        : currentStep > s.step
                        ? 'bg-zinc-700 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 font-semibold hidden sm:inline">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Stepper Form Body */}
            {confirmedBooking ? (
              <div className="py-6 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-zinc-800 text-white rounded-full flex items-center justify-center mx-auto border border-zinc-700">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Repair Saved to Database!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Your appointment is persisted in the database. You can track this ID anytime.
                </p>
                <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Repair ID:</span>
                    <span className="font-mono font-bold text-white">{confirmedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Device:</span>
                    <span className="font-semibold text-zinc-300">{confirmedBooking.brand} {confirmedBooking.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service Date:</span>
                    <span className="font-semibold text-zinc-300">{confirmedBooking.scheduledDate} ({confirmedBooking.timeSlot})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setCurrentStep(1);
                      setModelName('');
                    }}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Book Another
                  </button>
                  <button
                    onClick={() => handleTrackId(confirmedBooking.id)}
                    className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-black rounded-xl cursor-pointer"
                  >
                    Track Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-5 space-y-4">
                {/* Step 1: Device & Problem */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Device Type</label>
                      <select
                        value={selectedDeviceType}
                        onChange={(e) => setSelectedDeviceType(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white"
                      >
                        {deviceTypes.map((dt) => (
                          <option key={dt} value={dt}>{dt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Brand</label>
                        <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white"
                        >
                          {repairBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Model Name *</label>
                        <input
                          type="text"
                          required
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                          placeholder="e.g. iPhone 15 Pro"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Primary Issue</label>
                      <select
                        value={selectedIssue}
                        onChange={(e) => setSelectedIssue(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white"
                      >
                        {commonIssues.map((issue) => (
                          <option key={issue} value={issue}>{issue}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="rahul@example.com"
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Symptoms / Issue Details</label>
                      <textarea
                        rows={2}
                        value={deviceNotes}
                        onChange={(e) => setDeviceNotes(e.target.value)}
                        placeholder="Describe how the problem occurred or any specific requests..."
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Service Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setServiceMode('doorstep')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            serviceMode === 'doorstep'
                              ? 'border-white bg-zinc-800 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                          }`}
                        >
                          <span className="block font-bold">Doorstep Pickup</span>
                          <span className="text-[10px] text-zinc-500">Free courier pickup</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceMode('store')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            serviceMode === 'store'
                              ? 'border-white bg-zinc-800 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                          }`}
                        >
                          <span className="block font-bold">Walk-in Store</span>
                          <span className="text-[10px] text-zinc-500">Express 30m fix</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">Time Slot</label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white"
                        >
                          <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                          <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Confirm */}
                {currentStep === 4 && (
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs">
                    <h5 className="font-bold text-white border-b border-zinc-800 pb-2">
                      Review Appointment Details
                    </h5>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Device:</span>
                      <span className="font-semibold text-zinc-300">{selectedBrand} {modelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Problem:</span>
                      <span className="font-semibold text-zinc-300">{selectedIssue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Customer:</span>
                      <span className="font-semibold text-zinc-300">{customerName} ({customerPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Appointment:</span>
                      <span className="font-semibold text-zinc-300">{scheduledDate} · {timeSlot}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-800 font-bold">
                      <span className="text-white">Estimated Cost:</span>
                      <span className="text-white font-extrabold">From ₹1,499 (Diagnostic Free)</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-zinc-700"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={submittingBooking}
                    onClick={handleNextStep}
                    className="flex-1 py-3 px-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {submittingBooking
                      ? 'Saving to Database...'
                      : currentStep === 4
                      ? 'Confirm & Book Repair'
                      : currentStep === 1
                      ? 'Start Repair Booking'
                      : 'Continue'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Track Your Repair */}
          <div className="bg-zinc-900/70 rounded-3xl border border-zinc-800 p-6 sm:p-7 shadow-xl space-y-4 text-white">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Track Your Repair
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Check real-time status with your repair ID (Loaded from SQLite).
              </p>
            </div>

            {/* Input + Button inline */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackId();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="Enter repair ID (e.g. LS-REP-8492)"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Track'}
              </button>
            </form>

            {/* Quick demo sample tickets from SQLite */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span>Try sample IDs:</span>
              {['LS-REP-8492', 'LS-REP-1024'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTrackingIdInput(id);
                    handleTrackId(id);
                  }}
                  className="font-mono text-zinc-300 hover:text-white underline cursor-pointer"
                >
                  {id}
                </button>
              ))}
            </div>

            {trackingError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
                {trackingError}
              </p>
            )}

            {/* Live Interactive Tracking Timeline Result from SQLite */}
            {activeTrackingResult && (
              <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-white bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
                      {activeTrackingResult.id}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">
                      {activeTrackingResult.brand} {activeTrackingResult.model}
                    </h4>
                    <p className="text-xs text-zinc-400">{activeTrackingResult.issue}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-zinc-950 shadow-xs">
                    {activeTrackingResult.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                    <span>Progress: {activeTrackingResult.statusProgress}%</span>
                    <span>Est. Cost: ₹{activeTrackingResult.estimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${activeTrackingResult.statusProgress}%` }}
                    />
                  </div>
                </div>

                {activeTrackingResult.notes && (
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                    <span className="font-bold text-white block mb-0.5">Technician Note:</span>
                    {activeTrackingResult.notes}
                  </div>
                )}

                {/* Tracking Milestones */}
                <div className="space-y-2 pt-2 text-xs border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span className="font-semibold text-white">Booking Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeTrackingResult.statusProgress >= 40 ? 'text-white' : 'text-zinc-600'}`} />
                    <span className={activeTrackingResult.statusProgress >= 40 ? 'font-semibold text-white' : 'text-zinc-500'}>
                      Diagnosis & Spare Allocation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeTrackingResult.statusProgress >= 65 ? 'text-white' : 'text-zinc-600'}`} />
                    <span className={activeTrackingResult.statusProgress >= 65 ? 'font-semibold text-white' : 'text-zinc-500'}>
                      Repair & Quality Benchmark Test
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeTrackingResult.statusProgress >= 100 ? 'text-white' : 'text-zinc-600'}`} />
                    <span className={activeTrackingResult.statusProgress >= 100 ? 'font-semibold text-white' : 'text-zinc-500'}>
                      Ready for Customer Pickup / Dispatch
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RepairPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-zinc-500">Loading repair portal from database...</div>}>
      <RepairContent />
    </Suspense>
  );
}
