'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ContactPage() {
  const { showToast } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Message Received', 'Thank you! An LS Mobiles representative will call you shortly.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
          Contact LS Mobiles Support
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Have queries about products, bulk orders, or device repair statuses? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 shadow-xl flex items-start gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Phone Support</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Toll-free customer assistance</p>
              <p className="text-sm font-semibold text-zinc-200 mt-2">+91 80 4920 1800</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 shadow-xl flex items-start gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Email Enquiries</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Response within 2-4 hours</p>
              <p className="text-sm font-semibold text-zinc-200 mt-2">support@lsmobiles.in</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 shadow-xl flex items-start gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Flagship Service Center</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                #104, Tech Plaza, Commercial Complex, MG Road, Bengaluru, Karnataka 560001
              </p>
              <span className="text-xs font-semibold text-zinc-300 block mt-2">
                Open Mon - Sat: 9:30 AM - 8:30 PM
              </span>
            </div>
          </div>
        </div>

        {/* Contact message form */}
        <div className="lg:col-span-7 bg-zinc-900/60 p-8 rounded-3xl border border-zinc-800 shadow-xl text-white">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-800 text-white border border-zinc-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Thank you for contacting LS Mobiles. Our customer support executive will review your enquiry and respond shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-5 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">How can we help? *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your question, device issue, or feedback here..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
