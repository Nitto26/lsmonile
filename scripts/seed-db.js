const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'ls_mobiles.db');

const db = new Database(dbPath);

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
`);

console.log('Database tables verified at:', dbPath);
