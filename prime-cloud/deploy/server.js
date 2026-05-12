const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'prime-cloud-deploy-secret-key';

// ─── Admin Credentials ───
const ADMIN_EMAIL = 'squaretechksa@gmail.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Vision2060@%_P', 10);

// ─── Middleware ───
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── In-memory data store ───
const db = {
  products: [
    { id: 1, nameEn: 'Beef Burger', nameAr: 'برجر لحم', category: 'Burgers', price: 29, stock: 85, status: 'active' },
    { id: 2, nameEn: 'Grilled Chicken', nameAr: 'دجاج مشوي', category: 'Grill', price: 35, stock: 62, status: 'active' },
    { id: 3, nameEn: 'Arabic Shawarma', nameAr: 'شاورما عربي', category: 'Sandwiches', price: 18, stock: 120, status: 'active' },
    { id: 4, nameEn: 'French Fries', nameAr: 'بطاطس مقلية', category: 'Sides', price: 10, stock: 200, status: 'active' },
    { id: 5, nameEn: 'Soft Drink', nameAr: 'مشروب غازي', category: 'Drinks', price: 5, stock: 300, status: 'active' },
  ],
  categories: [
    { id: 1, nameEn: 'Burgers', nameAr: 'برجر', productsCount: 12, visible: true },
    { id: 2, nameEn: 'Grill', nameAr: 'مشاوي', productsCount: 8, visible: true },
    { id: 3, nameEn: 'Drinks', nameAr: 'مشروبات', productsCount: 10, visible: true },
  ],
  orders: [
    { id: '#ORD-1001', customer: 'Ahmad Al-Zahrani', branch: 1, time: '12:30 PM', total: 87, status: 'new' },
    { id: '#ORD-1002', customer: 'Sara Al-Qahtani', branch: 2, time: '12:45 PM', total: 45, status: 'preparing' },
  ],
  tenants: [{ id: 'demo-tenant', name: 'Demo Restaurant', slug: 'demo', plan: 'enterprise', isActive: true }],
  tenantUsers: [{ id: 'admin-1', tenantId: 'demo-tenant', name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD_HASH, role: 'admin', isActive: true }],
};

// ─── Auth Middleware ───
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ─── API Routes ───

// Auth
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.tenantUsers.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ accessToken: token, user: { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId } });
});

app.get('/api/v1/auth/me', authMiddleware, (req, res) => {
  const user = db.tenantUsers.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId });
});

// Products
app.get('/api/v1/products', (req, res) => {
  let result = [...db.products];
  if (req.query.search) result = result.filter(p => p.nameEn.toLowerCase().includes(req.query.search.toLowerCase()));
  if (req.query.category) result = result.filter(p => p.category === req.query.category);
  res.json({ data: result, total: result.length });
});

app.get('/api/v1/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/v1/products', authMiddleware, (req, res) => {
  const newProduct = { id: db.products.length + 1, ...req.body, status: req.body.status || 'active' };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/v1/products/:id', authMiddleware, (req, res) => {
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  res.json(db.products[idx]);
});

app.delete('/api/v1/products/:id', authMiddleware, (req, res) => {
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

// Orders
app.get('/api/v1/orders', (req, res) => {
  let result = [...db.orders];
  if (req.query.status) result = result.filter(o => o.status === req.query.status);
  res.json({ data: result, total: result.length });
});

app.post('/api/v1/orders', authMiddleware, (req, res) => {
  const newOrder = { id: `#ORD-${String(db.orders.length + 1001)}`, ...req.body, status: 'new', time: new Date().toLocaleTimeString() };
  db.orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// Categories
app.get('/api/v1/categories', (req, res) => res.json({ data: db.categories, total: db.categories.length }));

// Health
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Static File Serving ───

// Serve Dashboard exports
app.use('/_next', express.static(path.join(__dirname, 'public', 'dashboard', '_next')));
app.get('/dashboard/*', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'dashboard', req.path + '.html');
  res.sendFile(filePath, err => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'dashboard', '404.html'));
  });
});
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html')));
app.get('/:page', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'dashboard', req.params.page + '.html');
  res.sendFile(filePath, err => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'dashboard', 'index.html'));
  });
});

// Serve POS app at /pos
app.use('/pos', express.static(path.join(__dirname, 'public', 'pos')));
app.get('/pos/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pos', 'index.html')));

// ─── Start ───
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Prime Cloud] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[Prime Cloud] Dashboard: http://localhost:${PORT}`);
  console.log(`[Prime Cloud] POS: http://localhost:${PORT}/pos`);
  console.log(`[Prime Cloud] API: http://localhost:${PORT}/api/v1`);
});
