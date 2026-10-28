import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Product, RepairService, RepairBooking, Order, OrderItem } from '@/types';
import { products as initialProducts } from '@/data/products';
import { repairServices as initialRepairServices, initialRepairTickets } from '@/data/repairs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'ls_mobiles.db');

// Global database connection singleton for Next.js
declare global {
  // eslint-disable-next-line no-var
  var __ls_db: Database.Database | undefined;
}

function getDatabase(): Database.Database {
  if (!global.__ls_db) {
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initDatabase(db);
    global.__ls_db = db;
  }
  return global.__ls_db;
}

function initDatabase(db: Database.Database) {
  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      categoryLabel TEXT NOT NULL,
      price REAL NOT NULL,
      originalPrice REAL NOT NULL,
      discount REAL NOT NULL,
      rating REAL NOT NULL,
      reviewCount INTEGER NOT NULL,
      image TEXT NOT NULL,
      galleryImages TEXT NOT NULL,
      colors TEXT NOT NULL,
      storageOptions TEXT,
      isNew INTEGER NOT NULL DEFAULT 0,
      isBestseller INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      overviewHighlights TEXT NOT NULL,
      specifications TEXT NOT NULL,
      inTheBox TEXT NOT NULL,
      inStock INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS repair_services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priceFrom REAL NOT NULL,
      turnaroundTime TEXT NOT NULL,
      iconName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS repair_bookings (
      id TEXT PRIMARY KEY,
      deviceType TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      issue TEXT NOT NULL,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      serviceMode TEXT NOT NULL,
      scheduledDate TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL,
      statusProgress INTEGER NOT NULL,
      estimatedCost REAL NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      customerEmail TEXT,
      shippingAddress TEXT NOT NULL,
      city TEXT,
      pincode TEXT,
      totalAmount REAL NOT NULL,
      paymentMethod TEXT NOT NULL DEFAULT 'COD',
      paymentStatus TEXT NOT NULL DEFAULT 'pending',
      orderStatus TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      productId TEXT NOT NULL,
      productName TEXT NOT NULL,
      productImage TEXT,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      selectedColor TEXT,
      selectedStorage TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // Seed products if empty
  const productCount = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, brand, category, categoryLabel, price, originalPrice, discount,
        rating, reviewCount, image, galleryImages, colors, storageOptions,
        isNew, isBestseller, description, overviewHighlights, specifications,
        inTheBox, inStock
      ) VALUES (
        @id, @name, @brand, @category, @categoryLabel, @price, @originalPrice, @discount,
        @rating, @reviewCount, @image, @galleryImages, @colors, @storageOptions,
        @isNew, @isBestseller, @description, @overviewHighlights, @specifications,
        @inTheBox, @inStock
      )
    `);

    const insertMany = db.transaction((prods: Product[]) => {
      for (const p of prods) {
        insertProduct.run({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          categoryLabel: p.categoryLabel,
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount,
          rating: p.rating,
          reviewCount: p.reviewCount,
          image: p.image,
          galleryImages: JSON.stringify(p.galleryImages || []),
          colors: JSON.stringify(p.colors || []),
          storageOptions: p.storageOptions ? JSON.stringify(p.storageOptions) : null,
          isNew: p.isNew ? 1 : 0,
          isBestseller: p.isBestseller ? 1 : 0,
          description: p.description,
          overviewHighlights: JSON.stringify(p.overviewHighlights || []),
          specifications: JSON.stringify(p.specifications || {}),
          inTheBox: JSON.stringify(p.inTheBox || []),
          inStock: p.inStock ? 1 : 0,
        });
      }
    });

    insertMany(initialProducts);
  }

  // Seed repair services if empty
  const serviceCount = db.prepare('SELECT count(*) as count FROM repair_services').get() as { count: number };
  if (serviceCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO repair_services (id, title, description, priceFrom, turnaroundTime, iconName)
      VALUES (@id, @title, @description, @priceFrom, @turnaroundTime, @iconName)
    `);

    const insertManyServices = db.transaction((services: RepairService[]) => {
      for (const s of services) {
        insertService.run(s);
      }
    });

    insertManyServices(initialRepairServices);
  }

  // Seed repair bookings if empty
  const bookingCount = db.prepare('SELECT count(*) as count FROM repair_bookings').get() as { count: number };
  if (bookingCount.count === 0) {
    const insertBooking = db.prepare(`
      INSERT INTO repair_bookings (
        id, deviceType, brand, model, issue, customerName, phone, email,
        serviceMode, scheduledDate, timeSlot, notes, status, statusProgress,
        estimatedCost, createdAt
      ) VALUES (
        @id, @deviceType, @brand, @model, @issue, @customerName, @phone, @email,
        @serviceMode, @scheduledDate, @timeSlot, @notes, @status, @statusProgress,
        @estimatedCost, @createdAt
      )
    `);

    const insertManyBookings = db.transaction((bookings: RepairBooking[]) => {
      for (const b of bookings) {
        insertBooking.run(b);
      }
    });

    insertManyBookings(initialRepairTickets);
  }
}

// Transform raw SQLite row to typed Product
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    categoryLabel: row.categoryLabel,
    price: Number(row.price),
    originalPrice: Number(row.originalPrice),
    discount: Number(row.discount),
    rating: Number(row.rating),
    reviewCount: Number(row.reviewCount),
    image: row.image,
    galleryImages: JSON.parse(row.galleryImages || '[]'),
    colors: JSON.parse(row.colors || '[]'),
    storageOptions: row.storageOptions ? JSON.parse(row.storageOptions) : undefined,
    isNew: Boolean(row.isNew),
    isBestseller: Boolean(row.isBestseller),
    description: row.description,
    overviewHighlights: JSON.parse(row.overviewHighlights || '[]'),
    specifications: JSON.parse(row.specifications || '{}'),
    inTheBox: JSON.parse(row.inTheBox || '[]'),
    inStock: Boolean(row.inStock),
  };
}

// --- Product Queries ---
export function getAllProducts(): Product[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM products ORDER BY isNew DESC, createdAt DESC').all();
  return rows.map(mapRowToProduct);
}

export function getProductById(id: string): Product | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return null;
  return mapRowToProduct(row);
}

export function createProduct(product: Partial<Product> & { name: string; price: number; brand: string; category: string }): Product {
  const db = getDatabase();
  const id = product.id || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
  const categoryLabel = product.categoryLabel || product.category.charAt(0).toUpperCase() + product.category.slice(1);
  const originalPrice = product.originalPrice || product.price;
  const discount = product.discount || (originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0);

  const newProd: Product = {
    id,
    name: product.name,
    brand: product.brand,
    category: product.category as Product['category'],
    categoryLabel,
    price: product.price,
    originalPrice,
    discount,
    rating: product.rating || 4.5,
    reviewCount: product.reviewCount || 1,
    image: product.image || '/images/products/iphone-15.svg',
    galleryImages: product.galleryImages || [product.image || '/images/products/iphone-15.svg'],
    colors: product.colors || [{ name: 'Default', hex: '#2563EB' }],
    storageOptions: product.storageOptions,
    isNew: product.isNew !== undefined ? product.isNew : true,
    isBestseller: product.isBestseller || false,
    description: product.description || 'Premium mobile tech with full manufacturer warranty.',
    overviewHighlights: product.overviewHighlights || [
      { title: 'Flagship Tech', subtitle: 'Advanced performance', icon: 'sparkles' },
      { title: 'Official Warranty', subtitle: '1-Year brand assurance', icon: 'shield' },
    ],
    specifications: product.specifications || { 'Brand Warranty': '1 Year' },
    inTheBox: product.inTheBox || [product.name, 'Charging Cable', 'Manual'],
    inStock: product.inStock !== undefined ? product.inStock : true,
  };

  db.prepare(`
    INSERT INTO products (
      id, name, brand, category, categoryLabel, price, originalPrice, discount,
      rating, reviewCount, image, galleryImages, colors, storageOptions,
      isNew, isBestseller, description, overviewHighlights, specifications,
      inTheBox, inStock
    ) VALUES (
      @id, @name, @brand, @category, @categoryLabel, @price, @originalPrice, @discount,
      @rating, @reviewCount, @image, @galleryImages, @colors, @storageOptions,
      @isNew, @isBestseller, @description, @overviewHighlights, @specifications,
      @inTheBox, @inStock
    )
  `).run({
    id: newProd.id,
    name: newProd.name,
    brand: newProd.brand,
    category: newProd.category,
    categoryLabel: newProd.categoryLabel,
    price: newProd.price,
    originalPrice: newProd.originalPrice,
    discount: newProd.discount,
    rating: newProd.rating,
    reviewCount: newProd.reviewCount,
    image: newProd.image,
    galleryImages: JSON.stringify(newProd.galleryImages),
    colors: JSON.stringify(newProd.colors),
    storageOptions: newProd.storageOptions ? JSON.stringify(newProd.storageOptions) : null,
    isNew: newProd.isNew ? 1 : 0,
    isBestseller: newProd.isBestseller ? 1 : 0,
    description: newProd.description,
    overviewHighlights: JSON.stringify(newProd.overviewHighlights),
    specifications: JSON.stringify(newProd.specifications),
    inTheBox: JSON.stringify(newProd.inTheBox),
    inStock: newProd.inStock ? 1 : 0,
  });

  return newProd;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = getDatabase();
  const existing = getProductById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  if (updates.price && updates.originalPrice) {
    merged.discount = Math.round(((updates.originalPrice - updates.price) / updates.originalPrice) * 100);
  }

  db.prepare(`
    UPDATE products SET
      name = @name,
      brand = @brand,
      category = @category,
      categoryLabel = @categoryLabel,
      price = @price,
      originalPrice = @originalPrice,
      discount = @discount,
      rating = @rating,
      reviewCount = @reviewCount,
      image = @image,
      galleryImages = @galleryImages,
      colors = @colors,
      storageOptions = @storageOptions,
      isNew = @isNew,
      isBestseller = @isBestseller,
      description = @description,
      overviewHighlights = @overviewHighlights,
      specifications = @specifications,
      inTheBox = @inTheBox,
      inStock = @inStock,
      updatedAt = datetime('now')
    WHERE id = @id
  `).run({
    id,
    name: merged.name,
    brand: merged.brand,
    category: merged.category,
    categoryLabel: merged.categoryLabel,
    price: merged.price,
    originalPrice: merged.originalPrice,
    discount: merged.discount,
    rating: merged.rating,
    reviewCount: merged.reviewCount,
    image: merged.image,
    galleryImages: JSON.stringify(merged.galleryImages),
    colors: JSON.stringify(merged.colors),
    storageOptions: merged.storageOptions ? JSON.stringify(merged.storageOptions) : null,
    isNew: merged.isNew ? 1 : 0,
    isBestseller: merged.isBestseller ? 1 : 0,
    description: merged.description,
    overviewHighlights: JSON.stringify(merged.overviewHighlights),
    specifications: JSON.stringify(merged.specifications),
    inTheBox: JSON.stringify(merged.inTheBox),
    inStock: merged.inStock ? 1 : 0,
  });

  return merged;
}

export function deleteProduct(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}

// --- Repair Services Queries ---
export function getAllRepairServices(): RepairService[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM repair_services').all();
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priceFrom: Number(r.priceFrom),
    turnaroundTime: r.turnaroundTime,
    iconName: r.iconName,
  }));
}

export function updateRepairService(id: string, updates: Partial<RepairService>): RepairService | null {
  const db = getDatabase();
  const current = db.prepare('SELECT * FROM repair_services WHERE id = ?').get(id) as any;
  if (!current) return null;

  const merged = { ...current, ...updates };
  db.prepare(`
    UPDATE repair_services SET
      title = @title,
      description = @description,
      priceFrom = @priceFrom,
      turnaroundTime = @turnaroundTime
    WHERE id = @id
  `).run({
    id,
    title: merged.title,
    description: merged.description,
    priceFrom: Number(merged.priceFrom),
    turnaroundTime: merged.turnaroundTime,
  });

  return merged;
}

// --- Repair Bookings Queries ---
export function getAllRepairBookings(): RepairBooking[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM repair_bookings ORDER BY createdAt DESC').all();
  return rows.map((r: any) => ({
    id: r.id,
    deviceType: r.deviceType,
    brand: r.brand,
    model: r.model,
    issue: r.issue,
    customerName: r.customerName,
    phone: r.phone,
    email: r.email || '',
    serviceMode: r.serviceMode,
    scheduledDate: r.scheduledDate,
    timeSlot: r.timeSlot,
    notes: r.notes || '',
    status: r.status,
    statusProgress: Number(r.statusProgress),
    estimatedCost: Number(r.estimatedCost),
    createdAt: r.createdAt,
  }));
}

export function getRepairBookingById(id: string): RepairBooking | null {
  const db = getDatabase();
  const r = db.prepare('SELECT * FROM repair_bookings WHERE UPPER(id) = UPPER(?)').get(id) as any;
  if (!r) return null;
  return {
    id: r.id,
    deviceType: r.deviceType,
    brand: r.brand,
    model: r.model,
    issue: r.issue,
    customerName: r.customerName,
    phone: r.phone,
    email: r.email || '',
    serviceMode: r.serviceMode,
    scheduledDate: r.scheduledDate,
    timeSlot: r.timeSlot,
    notes: r.notes || '',
    status: r.status,
    statusProgress: Number(r.statusProgress),
    estimatedCost: Number(r.estimatedCost),
    createdAt: r.createdAt,
  };
}

export function createRepairBooking(booking: Partial<RepairBooking> & {
  deviceType: string;
  brand: string;
  model: string;
  issue: string;
  customerName: string;
  phone: string;
}): RepairBooking {
  const db = getDatabase();
  const id = booking.id || `LS-REP-${Math.floor(1000 + Math.random() * 9000)}`;
  const newBooking: RepairBooking = {
    id,
    deviceType: booking.deviceType,
    brand: booking.brand,
    model: booking.model,
    issue: booking.issue,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email || '',
    serviceMode: booking.serviceMode || 'doorstep',
    scheduledDate: booking.scheduledDate || new Date().toISOString().split('T')[0],
    timeSlot: booking.timeSlot || '11:00 AM - 01:00 PM',
    notes: booking.notes || '',
    status: booking.status || 'Booked',
    statusProgress: booking.statusProgress || 20,
    estimatedCost: booking.estimatedCost || 1499,
    createdAt: booking.createdAt || new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO repair_bookings (
      id, deviceType, brand, model, issue, customerName, phone, email,
      serviceMode, scheduledDate, timeSlot, notes, status, statusProgress,
      estimatedCost, createdAt
    ) VALUES (
      @id, @deviceType, @brand, @model, @issue, @customerName, @phone, @email,
      @serviceMode, @scheduledDate, @timeSlot, @notes, @status, @statusProgress,
      @estimatedCost, @createdAt
    )
  `).run(newBooking);

  return newBooking;
}

export function updateRepairBooking(id: string, updates: Partial<RepairBooking>): RepairBooking | null {
  const db = getDatabase();
  const current = getRepairBookingById(id);
  if (!current) return null;

  const merged = { ...current, ...updates };
  db.prepare(`
    UPDATE repair_bookings SET
      status = @status,
      statusProgress = @statusProgress,
      estimatedCost = @estimatedCost,
      notes = @notes
    WHERE UPPER(id) = UPPER(@id)
  `).run({
    id,
    status: merged.status,
    statusProgress: merged.statusProgress,
    estimatedCost: merged.estimatedCost,
    notes: merged.notes,
  });

  return merged;
}

// --- Order Queries ---
export function getAllOrders(): Order[] {
  const db = getDatabase();
  const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all() as any[];
  const items = db.prepare('SELECT * FROM order_items').all() as OrderItem[];

  const itemsByOrder = items.reduce((acc: Record<string, OrderItem[]>, item: OrderItem) => {
    if (!acc[item.orderId]) acc[item.orderId] = [];
    acc[item.orderId].push(item);
    return acc;
  }, {});

  return orders.map((o) => ({
    ...o,
    items: itemsByOrder[o.id] || [],
  }));
}

export function getOrderById(id: string): Order | null {
  const db = getDatabase();
  const order = db.prepare('SELECT * FROM orders WHERE id = ? OR orderNumber = ?').get(id, id) as any;
  if (!order) return null;

  const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id) as OrderItem[];
  return {
    ...order,
    items,
  };
}

export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> & { items: Omit<OrderItem, 'id' | 'orderId'>[] }): Order {
  const db = getDatabase();
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const orderNumber = `LSM-${Math.floor(100000 + Math.random() * 900000)}`;

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, orderNumber, customerName, customerPhone, customerEmail,
      shippingAddress, city, pincode, totalAmount, paymentMethod,
      paymentStatus, orderStatus, notes, createdAt, updatedAt
    ) VALUES (
      @id, @orderNumber, @customerName, @customerPhone, @customerEmail,
      @shippingAddress, @city, @pincode, @totalAmount, @paymentMethod,
      @paymentStatus, @orderStatus, @notes, datetime('now'), datetime('now')
    )
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (
      id, orderId, productId, productName, productImage, quantity, price, selectedColor, selectedStorage
    ) VALUES (
      @id, @orderId, @productId, @productName, @productImage, @quantity, @price, @selectedColor, @selectedStorage
    )
  `);

  const transaction = db.transaction(() => {
    insertOrder.run({
      id: orderId,
      orderNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail || null,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city || null,
      pincode: orderData.pincode || null,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: orderData.orderStatus || 'pending',
      notes: orderData.notes || null,
    });

    for (const item of orderData.items) {
      const itemId = `ITEM-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;
      insertItem.run({
        id: itemId,
        orderId,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage || null,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor || null,
        selectedStorage: item.selectedStorage || null,
      });
    }
  });

  transaction();
  return getOrderById(orderId)!;
}

export function updateOrderStatus(id: string, orderStatus: string, paymentStatus?: string): Order | null {
  const db = getDatabase();
  const current = getOrderById(id);
  if (!current) return null;

  const newPaymentStatus = paymentStatus || current.paymentStatus;
  db.prepare(`
    UPDATE orders SET
      orderStatus = @orderStatus,
      paymentStatus = @paymentStatus,
      updatedAt = datetime('now')
    WHERE id = @id
  `).run({
    id: current.id,
    orderStatus,
    paymentStatus: newPaymentStatus,
  });

  return getOrderById(current.id);
}

// --- Dashboard Statistics Query ---
export function getDashboardStats() {
  const db = getDatabase();
  const productStats = db.prepare(`SELECT count(*) as totalProducts, sum(price) as catalogValue, sum(CASE WHEN inStock = 0 THEN 1 ELSE 0 END) as outOfStock FROM products`).get() as any;
  const bookingStats = db.prepare(`SELECT count(*) as totalBookings, sum(CASE WHEN status != 'Ready' THEN 1 ELSE 0 END) as activeBookings, sum(CASE WHEN status = 'Ready' THEN 1 ELSE 0 END) as completedBookings, sum(estimatedCost) as totalRevenue FROM repair_bookings`).get() as any;
  const orderStats = db.prepare(`SELECT count(*) as totalOrders, sum(totalAmount) as totalOrderRevenue, sum(CASE WHEN orderStatus = 'pending' THEN 1 ELSE 0 END) as pendingOrders FROM orders`).get() as any;
  const recentBookings = db.prepare(`SELECT * FROM repair_bookings ORDER BY createdAt DESC LIMIT 5`).all();
  const recentOrders = db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5`).all();

  return {
    totalProducts: productStats?.totalProducts || 0,
    catalogValue: Math.round(productStats?.catalogValue || 0),
    outOfStock: productStats?.outOfStock || 0,
    totalBookings: bookingStats?.totalBookings || 0,
    activeBookings: bookingStats?.activeBookings || 0,
    completedBookings: bookingStats?.completedBookings || 0,
    totalRevenue: Math.round(bookingStats?.totalRevenue || 0),
    totalOrders: orderStats?.totalOrders || 0,
    totalOrderRevenue: Math.round(orderStats?.totalOrderRevenue || 0),
    pendingOrders: orderStats?.pendingOrders || 0,
    recentBookings,
    recentOrders,
  };
}

