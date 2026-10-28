'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Clock,
  ShoppingBag,
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
  Lock,
  LogOut,
  Phone,
  Mail,
  MapPin,
  FileText,
  Printer,
  Download,
  AlertTriangle,
  RefreshCw,
  Eye,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  Upload,
  FileSpreadsheet,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Product, RepairService, RepairBooking, Order } from '@/types';
import { useCart } from '@/context/CartContext';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

type AdminTab = 'dashboard' | 'orders' | 'products' | 'repair';

export default function AdminDashboardPage() {
  const { showToast } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Sidebar & Navigation States
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [repairSubTab, setRepairSubTab] = useState<'tickets' | 'services'>('tickets');

  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<RepairService[]>([]);
  const [bookings, setBookings] = useState<RepairBooking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>({
    totalProducts: 0,
    catalogValue: 0,
    outOfStock: 0,
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalOrderRevenue: 0,
    pendingOrders: 0,
    recentBookings: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals & Edit States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [editingBooking, setEditingBooking] = useState<RepairBooking | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Apple');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('smartphones');
  const [newProdPrice, setNewProdPrice] = useState<number>(49999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(54999);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80');
  const [newProdIsNew, setNewProdIsNew] = useState(true);
  const [newProdIsBestseller, setNewProdIsBestseller] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Excel Bulk Import State
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelParsedData, setExcelParsedData] = useState<any[]>([]);
  const [excelImportLoading, setExcelImportLoading] = useState(false);
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const editImageFileInputRef = useRef<HTMLInputElement>(null);

  // Check Authentication Status
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch {
      // fallback
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPinInput('');
        loadAllData();
        showToast('Authorized', 'Admin session active', 'success');
      } else {
        setAuthError(data.error || 'Incorrect passcode');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      showToast('Logged Out', 'Admin session terminated', 'info');
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Load live data from SQLite API
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, repRes, statRes, orderRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/repairs'),
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (repRes.ok) {
        const repData = await repRes.json();
        setServices(repData.services || []);
        setBookings(repData.bookings || []);
      }
      if (statRes.ok) setStats(await statRes.json());
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data from SQLite', err);
      showToast('Error', 'Failed to connect to SQLite database', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Image File Upload Handler
  const handleUploadFile = async (file: File, isEditMode = false) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isEditMode && editingProduct) {
          setEditingProduct({ ...editingProduct, image: data.url });
        } else {
          setNewProdImage(data.url);
        }
        showToast('Image Saved', 'File uploaded and stored in public folder', 'success');
      } else {
        showToast('Upload Error', data.error || 'Failed to upload image', 'warning');
      }
    } catch (err) {
      showToast('Upload Error', 'Network error during image upload', 'warning');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Excel Parser Handler
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Normalize rows to products schema
        const normalized = data.map((row: any) => ({
          name: String(row.name || row.Name || row.title || row.Title || ''),
          brand: String(row.brand || row.Brand || 'Apple'),
          category: String(row.category || row.Category || 'smartphones').toLowerCase(),
          price: Number(row.price || row.Price || 0),
          originalPrice: Number(row.originalPrice || row.OriginalPrice || row.mrp || row.MRP || row.price || 0),
          description: String(row.description || row.Description || 'Official device with full manufacturer warranty.'),
          image: String(row.image || row.Image || '/images/products/iphone-15.svg'),
          isNew: Boolean(row.isNew === 'true' || row.isNew === true || row.isNew === 1),
          isBestseller: Boolean(row.isBestseller === 'true' || row.isBestseller === true || row.isBestseller === 1),
        })).filter((p) => p.name && p.price > 0);

        setExcelParsedData(normalized);
        showToast('Excel Read', `Parsed ${normalized.length} valid product rows`, 'info');
      } catch (err) {
        console.error('Failed to parse excel:', err);
        showToast('Excel Error', 'Invalid or unreadable Excel/CSV spreadsheet', 'warning');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Submit Bulk Excel Products
  const handleImportExcelProducts = async () => {
    if (excelParsedData.length === 0) {
      showToast('Notice', 'No product rows to import', 'info');
      return;
    }

    try {
      setExcelImportLoading(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(excelParsedData),
      });

      const result = await res.json();
      if (res.ok && (result.success || Array.isArray(result))) {
        const count = result.count || excelParsedData.length;
        showToast('Bulk Import Complete', `Added ${count} products to SQLite database!`, 'success');
        setIsExcelModalOpen(false);
        setExcelFile(null);
        setExcelParsedData([]);
        loadAllData();
      } else {
        showToast('Error', result.error || 'Failed to import bulk products', 'warning');
      }
    } catch {
      showToast('Error', 'Network error during bulk import', 'warning');
    } finally {
      setExcelImportLoading(false);
    }
  };

  // Download Sample Excel Template
  const handleDownloadSampleTemplate = () => {
    const sampleRows = [
      {
        name: 'iPhone 16 Pro Max 256GB',
        brand: 'Apple',
        category: 'smartphones',
        price: 139999,
        originalPrice: 144999,
        description: 'Titanium design, A18 Pro chip, 48MP camera system.',
        isNew: true,
        isBestseller: true,
      },
      {
        name: 'Galaxy S25 Ultra 512GB',
        brand: 'Samsung',
        category: 'smartphones',
        price: 129999,
        originalPrice: 134999,
        description: 'Galaxy AI, Snapdragon 8 Elite, Built-in S-Pen.',
        isNew: true,
        isBestseller: false,
      },
      {
        name: 'AirPods Pro 2 USB-C',
        brand: 'Apple',
        category: 'earbuds',
        price: 24900,
        originalPrice: 26900,
        description: 'Active Noise Cancellation with Transparency Mode.',
        isNew: false,
        isBestseller: true,
      },
      {
        name: 'Anker 65W GaN Fast Charger',
        brand: 'Anker',
        category: 'chargers',
        price: 3499,
        originalPrice: 3999,
        description: 'Ultra-compact 3-port fast wall charger.',
        isNew: false,
        isBestseller: false,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'LS_Mobile_Products_Template.xlsx');
    showToast('Downloaded', 'Sample Excel template downloaded', 'success');
  };

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
        showToast('Updated', `${updated.name} updated in SQLite`, 'success');
        loadAllData();
      } else {
        showToast('Error', 'Failed to update product', 'warning');
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
          image: newProdImage || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80',
          isNew: newProdIsNew,
          isBestseller: newProdIsBestseller,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setIsAddProductOpen(false);
        setNewProdName('');
        setNewProdDescription('');
        showToast('Product Created', `${created.name} added to SQLite!`, 'success');
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
        showToast('Deleted', `Product "${name}" deleted.`, 'info');
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
        showToast('Service Updated', `${updated.title} rates saved to SQLite!`, 'success');
      }
    } catch {
      showToast('Error', 'Failed to update service', 'warning');
    }
  };

  // --- Booking / Ticket Handlers ---
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
        showToast('Ticket Updated', `Repair ${updated.id} status updated!`, 'success');
        loadAllData();
      }
    } catch {
      showToast('Error', 'Failed to update repair ticket', 'warning');
    }
  };

  // --- Order Status Handler ---
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.data : o)));
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder(data.data);
        }
        showToast('Order Updated', `Order ${data.data.orderNumber} marked as ${orderStatus}`, 'success');
        loadAllData();
      } else {
        showToast('Error', 'Failed to update order status', 'warning');
      }
    } catch {
      showToast('Error', 'Network error updating order', 'warning');
    }
  };

  // --- Export CSV Handler ---
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast('Notice', 'No orders to export', 'info');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LS_Mobile_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported', 'Orders CSV downloaded successfully', 'success');
  };

  // Product Categories for Filtering & Adding
  const productCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'tablets', label: 'Tablets' },
    { id: 'smart-watches', label: 'Smart Watches' },
    { id: 'earbuds', label: 'Earbuds & Audio' },
    { id: 'power-banks', label: 'Power Banks' },
    { id: 'chargers', label: 'Fast Chargers' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'components', label: 'Components' },
  ];

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredBookings = bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.model.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Navigation Items
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag, badge: stats.pendingOrders },
    { id: 'products' as const, label: 'Products', icon: Package, badge: stats.outOfStock ? `${stats.outOfStock} out` : undefined },
    { id: 'repair' as const, label: 'Repair', icon: Wrench, badge: stats.activeBookings },
  ];

  // Loading Screen
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] light:bg-[#f8fafc] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Verifying secure admin session...</p>
        </div>
      </div>
    );
  }

  // Passcode Gate Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] light:bg-[#f8fafc] flex items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-md bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 rounded-2xl flex items-center justify-center border border-zinc-700 dark:border-zinc-700 light:border-slate-200 shadow-inner">
              <Lock className="w-8 h-8 text-white dark:text-white light:text-slate-900" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-white dark:text-white light:text-slate-900">LS</span>
                <span className="text-2xl font-extrabold text-zinc-300 dark:text-zinc-300 light:text-slate-700 tracking-tight">ADMIN PORTAL</span>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">
                Enter your administrative passcode to unlock management controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4 pt-2">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter PIN (Default: 8888)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-white dark:focus:border-white light:focus:border-slate-900 font-mono"
                />
                {authError && <p className="text-xs text-rose-400 mt-2 text-center font-medium">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-black/40 cursor-pointer"
              >
                Authenticate & Access Dashboard
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 w-full flex items-center justify-between text-[11px] text-zinc-500 light:text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AES Protected
              </span>
              <div className="flex items-center gap-3">
                <AnimatedThemeToggler className="p-1 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors" />
                <Link href="/" className="hover:text-zinc-300 dark:hover:text-zinc-300 light:hover:text-slate-900 transition-colors">
                  Storefront →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] light:bg-[#f8fafc] text-zinc-100 dark:text-zinc-100 light:text-slate-900 flex transition-colors duration-200">
      {/* MOBILE BACKDROP FOR SIDEBAR */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* GEMINI-STYLE COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between border-r border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-[#09090b]/95 dark:bg-[#09090b]/95 light:bg-white/95 backdrop-blur-xl ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header: Logo & Toggle */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-black flex items-center justify-center flex-shrink-0 text-sm shadow-md transition-transform group-hover:scale-105">
                LS
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col animate-in fade-in duration-200 whitespace-nowrap">
                  <span className="text-sm font-black tracking-tight text-white dark:text-white light:text-slate-900 leading-tight">
                    LS MOBILES
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-semibold tracking-wider uppercase">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse toggle button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-1.5 rounded-lg text-zinc-400 dark:text-zinc-400 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60 light:hover:bg-slate-100 transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-lg shadow-black/20 font-black'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden text-left animate-in fade-in duration-150">
                      <span className="truncate text-xs capitalize">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                            isActive
                              ? 'bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-slate-900'
                              : 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Theme Toggle & Logout */}
        <div className="p-3 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-100 space-y-2">
          {/* Quick SQLite status indicator */}
          {isSidebarOpen && (
            <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-50 border border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200 text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
                <Database className="w-3.5 h-3.5" /> SQLite Engine
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 truncate mt-0.5">
                data/ls_mobiles.db
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="p-1 rounded-xl bg-zinc-800/60 dark:bg-zinc-800/60 light:bg-slate-100 flex items-center justify-center">
              <AnimatedThemeToggler className="p-1.5 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer" />
            </div>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-xl bg-rose-950/40 dark:bg-rose-950/40 light:bg-rose-50 hover:bg-rose-900/60 dark:hover:bg-rose-900/60 light:hover:bg-rose-100 text-rose-400 dark:text-rose-400 light:text-rose-600 transition-colors cursor-pointer border border-rose-900/40 dark:border-rose-900/40 light:border-rose-200 flex items-center justify-center ${
                isSidebarOpen ? 'flex-1 gap-1.5 text-xs font-bold' : ''
              }`}
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Minimal Gemini Top Bar: Logo + Theme Changer */}
        <header className="sticky top-0 z-30 h-16 bg-[#09090b]/80 dark:bg-[#09090b]/80 light:bg-white/80 backdrop-blur-xl border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 cursor-pointer"
              aria-label="Open sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white font-black flex items-center justify-center text-xs shadow-sm">
                LS
              </div>
              <span className="font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 text-sm md:text-base">
                MOBILES
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 uppercase tracking-wider hidden sm:inline-block">
                Admin
              </span>
            </Link>
          </div>

          {/* Right side: Storefront link + Theme Changer */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold text-xs rounded-xl transition-colors border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Storefront
            </Link>

            <button
              onClick={loadAllData}
              title="Refresh Data"
              className="p-2 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 rounded-xl transition-colors cursor-pointer border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Theme Changer */}
            <div className="p-1 rounded-xl bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-100 border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200 flex items-center justify-center">
              <AnimatedThemeToggler className="p-1.5 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header Title with Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                  <h1 className="text-2xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                    Dashboard Overview
                  </h1>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                    Live analytics and real-time operations across retail & repair services.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white p-5 sm:p-6 rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-xl backdrop-blur-xl">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-400 uppercase tracking-wider block mb-1">
                    Customer Orders
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white dark:text-white light:text-slate-900">{orders.length}</span>
                    <ShoppingBag className="w-6 h-6 text-zinc-400 dark:text-zinc-400 light:text-slate-700" />
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">
                    <span className="text-amber-400 dark:text-amber-400 light:text-amber-600 font-bold">{stats.pendingOrders || 0}</span> pending fulfillment
                  </p>
                </div>

                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white p-5 sm:p-6 rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-xl backdrop-blur-xl">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-400 uppercase tracking-wider block mb-1">
                    Order Revenue
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900">
                      ₹{(stats.totalOrderRevenue || 0).toLocaleString('en-IN')}
                    </span>
                    <TrendingUp className="w-6 h-6 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">Retail orders revenue</p>
                </div>

                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white p-5 sm:p-6 rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-xl backdrop-blur-xl">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-400 uppercase tracking-wider block mb-1">
                    Active Repairs
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white dark:text-white light:text-slate-900">{stats.activeBookings}</span>
                    <Wrench className="w-6 h-6 text-amber-400 dark:text-amber-400 light:text-amber-500" />
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">In diagnostic or repair stages</p>
                </div>

                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white p-5 sm:p-6 rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-xl backdrop-blur-xl">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-400 uppercase tracking-wider block mb-1">
                    Products in Catalog
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white dark:text-white light:text-slate-900">{stats.totalProducts}</span>
                    <Package className="w-6 h-6 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">₹{stats.catalogValue.toLocaleString('en-IN')} catalog value</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-7 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight">Recent Customer Orders</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">Live order activity from the online storefront.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-white dark:text-white light:text-slate-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 dark:text-zinc-500 light:text-slate-400 text-xs">
                    No orders recorded yet. Place an order from the cart to test the live pipeline.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-slate-50 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50 dark:divide-zinc-800/50 light:divide-slate-100">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-zinc-800/30 dark:hover:bg-zinc-800/30 light:hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-white dark:text-white light:text-slate-900">{o.orderNumber}</td>
                            <td className="py-3 px-4 font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-900">{o.customerName}</td>
                            <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">{o.customerPhone}</td>
                            <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">{o.items?.length || 1} item(s)</td>
                            <td className="py-3 px-4 font-bold text-white dark:text-white light:text-slate-900">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                                o.orderStatus === 'delivered'
                                  ? 'bg-emerald-950/60 dark:bg-emerald-950/60 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border border-emerald-800/50'
                                  : o.orderStatus === 'shipped'
                                  ? 'bg-blue-950/60 dark:bg-blue-950/60 light:bg-blue-100 text-blue-400 dark:text-blue-400 light:text-blue-800 border border-blue-800/50'
                                  : o.orderStatus === 'processing'
                                  ? 'bg-indigo-950/60 dark:bg-indigo-950/60 light:bg-indigo-100 text-indigo-400 dark:text-indigo-400 light:text-indigo-800 border border-indigo-800/50'
                                  : o.orderStatus === 'cancelled'
                                  ? 'bg-rose-950/60 dark:bg-rose-950/60 light:bg-rose-100 text-rose-400 dark:text-rose-400 light:text-rose-800 border border-rose-800/50'
                                  : 'bg-amber-950/60 dark:bg-amber-950/60 light:bg-amber-100 text-amber-400 dark:text-amber-400 light:text-amber-800 border border-amber-800/50'
                              }`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setViewingOrder(o)}
                                className="px-2.5 py-1 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 text-white dark:text-white light:text-slate-900 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-8 shadow-xl space-y-6 animate-in fade-in backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                    Customer Orders ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    Track, update status, generate invoices, and fulfill orders.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-500 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by order #, name, phone..."
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs text-zinc-100 dark:text-zinc-100 light:text-slate-900 focus:outline-none focus:border-white dark:focus:border-white light:focus:border-slate-900"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3.5 py-2 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 dark:text-zinc-500 light:text-slate-400 text-xs">
                  No matching orders found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-slate-50 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items Ordered</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 dark:divide-zinc-800/50 light:divide-slate-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-zinc-800/30 dark:hover:bg-zinc-800/30 light:hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-white dark:text-white light:text-slate-900">{o.orderNumber}</td>
                          <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-500 whitespace-nowrap">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">{o.customerName}</span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">{o.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                            <span className="font-semibold block">{o.items?.length || 1} item(s)</span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 line-clamp-1">
                              {o.items?.map((i) => i.productName).join(', ') || 'LS Mobile Product'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-white dark:text-white light:text-slate-900">
                            ₹{o.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-700 block">{o.paymentMethod}</span>
                            <span className={`text-[10px] font-bold uppercase ${
                              o.paymentStatus === 'paid' ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600' : 'text-amber-400 dark:text-amber-400 light:text-amber-600'
                            }`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 border border-zinc-700 dark:border-zinc-700 light:border-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setViewingOrder(o)}
                              className="p-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              title="View Invoice & Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-8 shadow-xl space-y-6 animate-in fade-in backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                    Product Catalog ({filteredProducts.length})
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    Filter by category, add products with image upload, or import from Excel.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Category Filter Dropdown */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="py-2 px-3 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium focus:outline-none"
                  >
                    {productCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {/* Search bar */}
                  <div className="relative w-full sm:w-56">
                    <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-500 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search name, brand..."
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs text-zinc-100 dark:text-zinc-100 light:text-slate-900 focus:outline-none focus:border-white dark:focus:border-white light:focus:border-slate-900"
                    />
                  </div>

                  {/* Import Excel Button */}
                  <button
                    onClick={() => setIsExcelModalOpen(true)}
                    className="px-3.5 py-2 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200 whitespace-nowrap"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Excel Import
                  </button>

                  {/* Add Product Button */}
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {/* Category Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {productCategories.map((cat) => {
                  const isSelected = productCategoryFilter === cat.id;
                  const count =
                    cat.id === 'all'
                      ? products.length
                      : products.filter((p) => p.category.toLowerCase() === cat.id.toLowerCase()).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-sm'
                          : 'bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-zinc-800 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-slate-900 font-black' : 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-zinc-400 dark:text-zinc-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-slate-50 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-bold uppercase tracking-wider">
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
                  <tbody className="divide-y divide-zinc-800/50 dark:divide-zinc-800/50 light:divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                          No products found matching category & search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-800/30 dark:hover:bg-zinc-800/30 light:hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 rounded-xl p-1 flex items-center justify-center border border-zinc-700 dark:border-zinc-700 light:border-slate-200 flex-shrink-0 overflow-hidden">
                              <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block line-clamp-1">{p.name}</span>
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono">{p.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">{p.brand}</td>
                          <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600 capitalize">{p.categoryLabel || p.category}</td>
                          <td className="py-3 px-4 font-extrabold text-white dark:text-white light:text-slate-900">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-zinc-500 dark:text-zinc-500 light:text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-600">{p.discount}%</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              p.inStock
                                ? 'bg-emerald-950/60 dark:bg-emerald-950/60 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border border-emerald-800/50'
                                : 'bg-rose-950/60 dark:bg-rose-950/60 light:bg-rose-100 text-rose-400 dark:text-rose-400 light:text-rose-800 border border-rose-800/50'
                            }`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                              title="Edit Product & Image"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 hover:bg-rose-950/60 dark:hover:bg-rose-950/60 light:hover:bg-rose-50 text-rose-400 dark:text-rose-400 light:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REPAIR (Tickets & Services with clean pill sub-tabs) */}
          {activeTab === 'repair' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header with Sub-tab toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                    Repair Center Management
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    Manage incoming repair tickets and configure service pricing rates.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-2xl">
                  <button
                    onClick={() => setRepairSubTab('tickets')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      repairSubTab === 'tickets'
                        ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-md'
                        : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tickets ({bookings.length})</span>
                  </button>
                  <button
                    onClick={() => setRepairSubTab('services')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      repairSubTab === 'services'
                        ? 'bg-white dark:bg-white light:bg-slate-900 text-black dark:text-black light:text-white shadow-md'
                        : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Services & Rates ({services.length})</span>
                  </button>
                </div>
              </div>

              {/* Subtab: Tickets */}
              {repairSubTab === 'tickets' && (
                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-sm font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                      Active & Past Tickets ({filteredBookings.length})
                    </span>

                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-500 light:text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        placeholder="Search by ID, name, model..."
                        className="w-full pl-9 pr-4 py-2 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs text-zinc-100 dark:text-zinc-100 light:text-slate-900 focus:outline-none focus:border-white dark:focus:border-white light:focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-slate-50 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-bold uppercase tracking-wider">
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
                      <tbody className="divide-y divide-zinc-800/50 dark:divide-zinc-800/50 light:divide-slate-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-zinc-800/30 dark:hover:bg-zinc-800/30 light:hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-white dark:text-white light:text-slate-900">{b.id}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">{b.customerName}</span>
                              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">{b.phone}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-800 block">{b.brand} {b.model}</span>
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-500">{b.issue}</span>
                            </td>
                            <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">{b.scheduledDate}</td>
                            <td className="py-3 px-4 font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800">₹{b.estimatedCost.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div className="bg-white dark:bg-white light:bg-slate-900 h-full rounded-full" style={{ width: `${b.statusProgress}%` }} />
                                </div>
                                <span className="font-semibold text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">{b.statusProgress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full font-bold ${
                                b.status === 'Ready'
                                  ? 'bg-emerald-950/60 dark:bg-emerald-950/60 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border border-emerald-800/50'
                                  : 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 text-zinc-200 dark:text-zinc-200 light:text-slate-800 border border-zinc-700/60'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <a
                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.customerName}, this is LS Mobile regarding your repair ticket ${b.id}. Current status: ${b.status}.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1.5 hover:bg-emerald-950/60 dark:hover:bg-emerald-950/60 light:hover:bg-emerald-50 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                                title="Notify on WhatsApp"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setEditingBooking(b)}
                                className="p-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Update Status"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab: Services */}
              {repairSubTab === 'services' && (
                <div className="bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
                  <div>
                    <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                      Base Repair Rates & Turnaround Times
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                      Updates reflect on the public repair portal immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((s) => (
                      <div key={s.id} className="border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-2xl p-5 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-base">{s.title}</h4>
                            <button
                              onClick={() => setEditingService(s)}
                              className="p-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mb-4">{s.description}</p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-bold block">STARTING PRICE</span>
                            <span className="font-extrabold text-white dark:text-white light:text-slate-900 text-sm">
                              ₹{s.priceFrom.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-bold block">ESTIMATED TIME</span>
                            <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">{s.turnaroundTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EXCEL BULK PRODUCT IMPORT */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-800 light:border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900">Import Products via Excel</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    Upload an .xlsx or .csv spreadsheet with columns: <code>name</code>, <code>brand</code>, <code>category</code>, <code>price</code>, <code>originalPrice</code>, <code>description</code>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsExcelModalOpen(false);
                  setExcelFile(null);
                  setExcelParsedData([]);
                }}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Download Prompt */}
            <div className="bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-50 p-4 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">Need the exact column format?</span>
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500 text-[11px]">Download our sample spreadsheet pre-filled with compatible headers.</span>
              </div>
              <button
                onClick={handleDownloadSampleTemplate}
                className="px-3 py-1.5 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Sample Template
              </button>
            </div>

            {/* Drag & Drop / File Input */}
            <div
              onClick={() => excelFileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 dark:border-zinc-700 light:border-slate-300 hover:border-white dark:hover:border-white light:hover:border-slate-900 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-slate-50"
            >
              <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                {excelFile ? excelFile.name : 'Click to select or drag & drop Excel / CSV file'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">Supports .xlsx, .xls, .csv</p>
              <input
                ref={excelFileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelFileChange}
                className="hidden"
              />
            </div>

            {/* Preview of Parsed Rows */}
            {excelParsedData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready to import {excelParsedData.length} product(s)
                  </span>
                  <span className="text-zinc-500">Previewing first 3 rows:</span>
                </div>
                <div className="max-h-40 overflow-y-auto divide-y divide-zinc-800 dark:divide-zinc-800 light:divide-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-xl text-xs bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50">
                  {excelParsedData.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-zinc-500">{item.brand} · {item.category}</span>
                      </div>
                      <span className="font-bold text-white dark:text-white light:text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExcelModalOpen(false);
                  setExcelFile(null);
                  setExcelParsedData([]);
                }}
                className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={excelParsedData.length === 0 || excelImportLoading}
                onClick={handleImportExcelProducts}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                {excelImportLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <span>Import {excelParsedData.length} Products to SQLite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ORDER DETAILS & INVOICE */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-800 light:border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500 light:text-slate-400 uppercase tracking-wider block">Customer Order</span>
                <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900 font-mono">{viewingOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 p-4 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs">
              <div>
                <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-bold block mb-1">CUSTOMER</span>
                <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">{viewingOrder.customerName}</span>
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 block">{viewingOrder.customerPhone}</span>
                {viewingOrder.customerEmail && <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 block">{viewingOrder.customerEmail}</span>}
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-bold block mb-1">SHIPPING ADDRESS</span>
                <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 block">{viewingOrder.shippingAddress}</span>
                <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-500 block mt-1">Payment: {viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})</span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase tracking-wider block">Order Items</span>
              <div className="divide-y divide-zinc-800 dark:divide-zinc-800 light:divide-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-2xl overflow-hidden">
                {viewingOrder.items && viewingOrder.items.length > 0 ? (
                  viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-contain rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-100 p-1 bg-zinc-900 dark:bg-zinc-900 light:bg-slate-50" />
                        )}
                        <div>
                          <span className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-900 block">{item.productName}</span>
                          <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 text-[11px]">
                            Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''} {item.selectedStorage ? `• ${item.selectedStorage}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-white dark:text-white light:text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400">Order item details stored in record.</div>
                )}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 p-4 rounded-2xl flex items-center justify-between text-sm border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
              <span className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700">Total Invoice Amount</span>
              <span className="text-xl font-black text-white dark:text-white light:text-slate-900">₹{viewingOrder.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-200 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setViewingOrder(null)}
                className="flex-1 py-3 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH IMAGE UPLOAD PREVIEW */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900">Add New Product</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                  Upload an image from your computer or provide a direct web image URL.
                </p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 16 Pro Max 256GB"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Brand</label>
                  <select
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Sony">Sony</option>
                    <option value="Anker">Anker</option>
                    <option value="Nothing">Nothing</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="tablets">Tablets</option>
                    <option value="smart-watches">Smart Watches</option>
                    <option value="earbuds">Earbuds & Audio</option>
                    <option value="power-banks">Power Banks</option>
                    <option value="chargers">Fast Chargers</option>
                    <option value="accessories">Accessories</option>
                    <option value="components">Components</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">MRP Original (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & LIVE PREVIEW SECTION */}
              <div className="space-y-2 p-3.5 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800 block">
                    Product Image (Stored in public/uploads/products)
                  </label>
                  <span className="text-[10px] text-zinc-500">Live preview below</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-20 h-20 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-xl border border-zinc-700 dark:border-zinc-700 light:border-slate-300 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-inner">
                    {newProdImage ? (
                      <img src={newProdImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-600" />
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button & URL field */}
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => imageFileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-700/60"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Image from Device'}</span>
                    </button>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadFile(file, false);
                      }}
                      className="hidden"
                    />

                    <div>
                      <input
                        type="text"
                        placeholder="Or enter image URL directly"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-200 dark:text-zinc-200 light:text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  placeholder="Official brand warranty, fast charging supported..."
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsNew}
                    onChange={(e) => setNewProdIsNew(e.target.checked)}
                    className="rounded border-zinc-700 text-white focus:ring-white"
                  />
                  <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">Flag as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsBestseller}
                    onChange={(e) => setNewProdIsBestseller(e.target.checked)}
                    className="rounded border-zinc-700 text-white focus:ring-white"
                  />
                  <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">Flag as Bestseller</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" /> Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT WITH IMAGE REPLACEMENT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400">{editingProduct.id}</span>
                <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900">Edit Product</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                  />
                </div>
              </div>

              {/* Image Editor */}
              <div className="p-3.5 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 space-y-2">
                <label className="font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800 block">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-xl border border-zinc-700 dark:border-zinc-700 light:border-slate-300 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-inner">
                    <img src={editingProduct.image} alt={editingProduct.name} className="max-h-full max-w-full object-contain" />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => editImageFileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Replace Image from Device'}</span>
                    </button>
                    <input
                      ref={editImageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadFile(file, true);
                      }}
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="Image URL"
                      className="w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-zinc-200 dark:text-zinc-200 light:text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <span className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700">Stock Availability</span>
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, inStock: !editingProduct.inStock })}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    editingProduct.inStock
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {editingProduct.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT REPAIR SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900">Edit Repair Service</h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingService.priceFrom}
                  onChange={(e) => setEditingService({ ...editingService, priceFrom: Number(e.target.value) })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  required
                  value={editingService.turnaroundTime}
                  onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" /> Save Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BOOKING STATUS & TECHNICIAN NOTES */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400">{editingBooking.id}</span>
                <h3 className="text-xl font-black text-white dark:text-white light:text-slate-900">Update Repair Ticket</h3>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Repair Stage / Status</label>
                <select
                  value={editingBooking.status}
                  onChange={(e) => {
                    const status = e.target.value as any;
                    let progress = editingBooking.statusProgress;
                    if (status === 'Booked') progress = 10;
                    if (status === 'Device Received') progress = 30;
                    if (status === 'Diagnosis') progress = 50;
                    if (status === 'Repairing') progress = 75;
                    if (status === 'Quality Check') progress = 90;
                    if (status === 'Ready') progress = 100;
                    setEditingBooking({ ...editingBooking, status, statusProgress: progress });
                  }}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                >
                  <option value="Booked">Booked</option>
                  <option value="Device Received">Device Received</option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="Repairing">Repairing</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Ready">Ready for Customer</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                  <span>Progress Percentage</span>
                  <span className="text-white dark:text-white light:text-slate-900 font-extrabold">{editingBooking.statusProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editingBooking.statusProgress}
                  onChange={(e) => setEditingBooking({ ...editingBooking, statusProgress: Number(e.target.value) })}
                  className="w-full h-2 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-white dark:accent-white light:accent-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={editingBooking.estimatedCost}
                  onChange={(e) => setEditingBooking({ ...editingBooking, estimatedCost: Number(e.target.value) })}
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-1">Technician Diagnostic Notes</label>
                <textarea
                  rows={3}
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  placeholder="e.g. OEM display installed. Thermal paste reapplied. Battery health 100%."
                  className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-zinc-100 dark:text-zinc-100 light:text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="flex-1 py-3 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white dark:bg-white light:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-zinc-200 light:hover:bg-slate-800 text-black dark:text-black light:text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
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
