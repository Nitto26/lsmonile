'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Search,
  ExternalLink,
  Save,
  X,
  Database,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { Product, RepairService, RepairBooking } from '@/types';
import { useCart } from '@/context/CartContext';

export default function AdminDashboardPage() {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'services' | 'bookings'>('overview');

  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<RepairService[]>([]);
  const [bookings, setBookings] = useState<RepairBooking[]>([]);
  const [stats, setStats] = useState<any>({
    totalProducts: 0,
    catalogValue: 0,
    outOfStock: 0,
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [editingBooking, setEditingBooking] = useState<RepairBooking | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Apple');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('smartphones');
  const [newProdPrice, setNewProdPrice] = useState<number>(49999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(54999);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdIsNew, setNewProdIsNew] = useState(true);
  const [newProdIsBestseller, setNewProdIsBestseller] = useState(false);

  // Load live data from SQLite API
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, repRes, statRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/repairs'),
        fetch('/api/admin/stats'),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (repRes.ok) {
        const repData = await repRes.json();
        setServices(repData.services || []);
        setBookings(repData.bookings || []);
      }
      if (statRes.ok) setStats(await statRes.json());
    } catch (err) {
      console.error('Failed to load admin data from SQLite', err);
      showToast('Error', 'Failed to connect to SQLite database', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Product Handlers ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingProduct(null);
        showToast('Updated', `${updated.name} updated in SQLite database`, 'success');
        loadAllData();
      } else {
        showToast('Error', 'Failed to update product in database', 'warning');
      }
    } catch {
      showToast('Error', 'Network error', 'warning');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          brand: newProdBrand,
          category: newProdCategory,
          price: Number(newProdPrice),
          originalPrice: Number(newProdOriginalPrice),
          description: newProdDescription || 'Official device with full manufacturer warranty.',
          isNew: newProdIsNew,
          isBestseller: newProdIsBestseller,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setIsAddProductOpen(false);
        // Reset form
        setNewProdName('');
        setNewProdDescription('');
        showToast('Product Created', `${created.name} added to SQLite database!`, 'success');
        loadAllData();
      } else {
        showToast('Error', 'Could not create product', 'warning');
      }
    } catch {
      showToast('Error', 'Network error', 'warning');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Deleted', `Product "${name}" deleted from database.`, 'info');
        loadAllData();
      } else {
        showToast('Error', 'Failed to delete product', 'warning');
      }
    } catch {
      showToast('Error', 'Network error', 'warning');
    }
  };

  // --- Service Handlers ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch('/api/repairs/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        const updated = await res.json();
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditingService(null);
        showToast('Service Updated', `${updated.title} updated in SQLite!`, 'success');
      }
    } catch {
      showToast('Error', 'Failed to update service', 'warning');
    }
  };

  // --- Booking Handlers ---
  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const res = await fetch(`/api/repairs/${editingBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBooking),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setEditingBooking(null);
        showToast('Ticket Updated', `Repair ${updated.id} status updated in SQLite!`, 'success');
        loadAllData();
      }
    } catch {
      showToast('Error', 'Failed to update repair ticket', 'warning');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.model.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-blue-600">LS</span>
              <span className="text-2xl font-extrabold text-slate-900">ADMIN SUITE</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <Database className="w-3.5 h-3.5" /> SQLite Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live Database Manager: <code className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">data/ls_mobiles.db</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" /> View Storefront
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
            { id: 'products', label: `Products Catalog (${products.length})`, icon: Package },
            { id: 'services', label: `Repair Services (${services.length})`, icon: Wrench },
            { id: 'bookings', label: `Repair Tickets (${bookings.length})`, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Products
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900">{stats.totalProducts}</span>
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 mt-2">Stored in SQLite</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Catalog Total Value
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{stats.catalogValue.toLocaleString('en-IN')}
                  </span>
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 mt-2">Retail inventory value</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Repairs
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-blue-600">{stats.activeBookings}</span>
                  <Wrench className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 mt-2">In diagnosis or repair</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Completed Repairs
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-600">{stats.completedBookings}</span>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 mt-2">Ready for customer</p>
              </div>
            </div>

            {/* Recent Repair Tickets */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Recent Repair Bookings in SQLite
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Manage All Tickets →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Device</th>
                      <th className="py-3 px-4">Issue</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{b.customerName}</td>
                        <td className="py-3 px-4 text-slate-600">{b.brand} {b.model}</td>
                        <td className="py-3 px-4 text-slate-600">{b.issue}</td>
                        <td className="py-3 px-4">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${b.statusProgress}%` }} />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold ${
                            b.status === 'Ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Products in SQLite ({filteredProducts.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Update prices, discounts, and inventory status in real-time.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Original</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg p-1 flex items-center justify-center border border-slate-200 flex-shrink-0">
                          <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{p.brand}</td>
                      <td className="py-3 px-4 text-slate-600">{p.categoryLabel}</td>
                      <td className="py-3 px-4 font-extrabold text-blue-600">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{p.discount}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REPAIR SERVICES */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Repair Services & Pricing in SQLite
              </h3>
              <p className="text-xs text-slate-500">
                Update base starting prices and turnaround times. Changes reflect on the public repair portal immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-base">{s.title}</h4>
                      <button
                        onClick={() => setEditingService(s)}
                        className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{s.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">STARTING PRICE</span>
                      <span className="font-extrabold text-blue-600 text-sm">
                        ₹{s.priceFrom.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">ESTIMATED TIME</span>
                      <span className="font-semibold text-slate-700">{s.turnaroundTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REPAIR TICKETS & WORKFLOW */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Repair Tickets Workflow ({filteredBookings.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Update customer ticket status, progress percentages, and technician diagnosis notes.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by ID, name, model..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Customer & Phone</th>
                    <th className="py-3 px-4">Device & Problem</th>
                    <th className="py-3 px-4">Scheduled Date</th>
                    <th className="py-3 px-4">Est. Cost</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{b.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{b.customerName}</span>
                        <span className="text-[11px] text-slate-500">{b.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{b.brand} {b.model}</span>
                        <span className="text-[11px] text-slate-500">{b.issue}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{b.scheduledDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">₹{b.estimatedCost.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${b.statusProgress}%` }} />
                          </div>
                          <span className="font-semibold text-[10px] text-slate-500">{b.statusProgress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          b.status === 'Ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingBooking(b)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-4">Edit Product in SQLite</h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Label</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.categoryLabel}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestseller}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Bestseller Badge</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-4">Add New Product to SQLite</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Pixel 8 Pro"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                  <select
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold"
                  >
                    {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 'boAt', 'Noise', 'Ambrane'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="tablets">Tablets</option>
                    <option value="smart-watches">Smart Watches</option>
                    <option value="earbuds">Earbuds & Audio</option>
                    <option value="power-banks">Power Banks</option>
                    <option value="chargers">Chargers</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Key features and specifications..."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsNew}
                    onChange={(e) => setNewProdIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">New Arrival Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsBestseller}
                    onChange={(e) => setNewProdIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-800">Bestseller Badge</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Insert to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-4">Edit Repair Service</h3>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingService.priceFrom}
                    onChange={(e) => setEditingService({ ...editingService, priceFrom: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    required
                    value={editingService.turnaroundTime}
                    onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BOOKING STATUS & PROGRESS */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setEditingBooking(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Update Repair Ticket</h3>
            <p className="text-xs text-blue-600 font-mono font-bold mb-4">{editingBooking.id}</p>

            <form onSubmit={handleSaveBooking} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Workflow Status</label>
                <select
                  value={editingBooking.status}
                  onChange={(e) => {
                    const st = e.target.value as RepairBooking['status'];
                    let pr = editingBooking.statusProgress;
                    if (st === 'Booked') pr = 20;
                    if (st === 'Diagnosis') pr = 40;
                    if (st === 'Repairing') pr = 65;
                    if (st === 'Quality Check') pr = 85;
                    if (st === 'Ready') pr = 100;
                    setEditingBooking({ ...editingBooking, status: st, statusProgress: pr });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold"
                >
                  <option value="Booked">Booked (Registered)</option>
                  <option value="Device Received">Device Received</option>
                  <option value="Diagnosis">Diagnosis & Spare Allocation</option>
                  <option value="Repairing">Repairing</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Ready">Ready for Customer Pickup / Dispatch</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Progress Percentage</span>
                  <span className="text-blue-600">{editingBooking.statusProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editingBooking.statusProgress}
                  onChange={(e) => setEditingBooking({ ...editingBooking, statusProgress: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={editingBooking.estimatedCost}
                  onChange={(e) => setEditingBooking({ ...editingBooking, estimatedCost: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Technician Diagnostic Notes</label>
                <textarea
                  rows={3}
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  placeholder="e.g. OEM display installed. Thermal paste reapplied. Battery health 100%."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
