const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'ls_mobiles.db');
console.log('Testing DB at:', dbPath);

const db = new Database(dbPath);
const products = db.prepare('SELECT count(*) as count FROM products').get();
const services = db.prepare('SELECT count(*) as count FROM repair_services').get();
const bookings = db.prepare('SELECT count(*) as count FROM repair_bookings').get();

console.log('Products in SQLite:', products.count);
console.log('Repair Services in SQLite:', services.count);
console.log('Repair Bookings in SQLite:', bookings.count);
