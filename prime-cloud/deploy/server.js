const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── Health Check ───
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── API Routes (NestJS compiled) ───
try {
  const apiPath = path.join(__dirname, 'api', 'main.js');
  const nestApp = require(apiPath);
  if (typeof nestApp.bootstrap === 'function') {
    // NestJS will handle /api/v1/* routes
  }
} catch (err) {
  // Fallback API if NestJS is not built
  console.log('[Deploy] NestJS API not found, using fallback API');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const fallbackDb = {
    products: [],
    categories: [],
    tenants: [{ id: 'demo', name: 'Prime Cloud', slug: 'prime', plan: 'enterprise', isActive: true }],
    users: [],
    invoices: [],
  };

  const JWT_SECRET = process.env.JWT_SECRET || 'prime-cloud-fallback-secret';

  app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = fallbackDb.users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ accessToken: token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post('/api/v1/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (fallbackDb.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email exists' });
    const user = { id: crypto.randomUUID(), email, password: bcrypt.hashSync(password, 10), name, role: 'owner', tenantId: 'demo', isActive: true };
    fallbackDb.users.push(user);
    const token = jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ accessToken: token, user });
  });

  app.get('/api/v1/products', (_req, res) => res.json({ data: fallbackDb.products, total: fallbackDb.products.length }));
  app.post('/api/v1/products', (req, res) => {
    const product = { id: crypto.randomUUID(), ...req.body, isActive: true };
    fallbackDb.products.push(product);
    res.status(201).json(product);
  });
  app.get('/api/v1/invoices', (_req, res) => res.json(fallbackDb.invoices));
  app.get('/api/v1/invoices/stats', (_req, res) => {
    const total = fallbackDb.invoices.reduce((s, i) => s + (i.total || 0), 0);
    const vat = fallbackDb.invoices.reduce((s, i) => s + (i.vat || 0), 0);
    res.json({ totalRevenue: total, totalVat: vat, count: fallbackDb.invoices.length });
  });
  app.post('/api/v1/invoices', (req, res) => {
    const invoice = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString() };
    fallbackDb.invoices.push(invoice);
    res.status(201).json(invoice);
  });

  // ─── Dashboard API (Demo) ───
  app.get('/api/v1/dashboard/stats', (_req, res) => {
    res.json({
      totalRevenue: 48750000,
      totalVat: 7312500,
      invoiceCount: 1247,
      todayTransactions: 38,
      activeSessions: 12,
      activeBranches: 5,
      pendingZatca: 3,
      lowStockItems: 7,
    });
  });
  app.get('/api/v1/dashboard/recent-transactions', (_req, res) => {
    res.json([
      { id: '1', invoiceNumber: 'INV-2024-8941', customer: 'مؤسسة النور للتجارة', amount: 245000, status: 'completed', time: '10:32 ص', paymentMethod: 'Mada' },
      { id: '2', invoiceNumber: 'INV-2024-8940', customer: 'شركة الراشد المحدودة', amount: 89000, status: 'completed', time: '10:15 ص', paymentMethod: 'Apple Pay' },
      { id: '3', invoiceNumber: 'INV-2024-8939', customer: 'مطعم البستان', amount: 156000, status: 'completed', time: '09:58 ص', paymentMethod: 'Cash' },
      { id: '4', invoiceNumber: 'INV-2024-8938', customer: 'مؤسسة الفهد', amount: 423000, status: 'completed', time: '09:30 ص', paymentMethod: 'Credit Card' },
      { id: '5', invoiceNumber: 'INV-2024-8937', customer: 'محل العطاء', amount: 34200, status: 'cancelled', time: '08:45 ص', paymentMethod: 'Mada' },
      { id: '6', invoiceNumber: 'INV-2024-8936', customer: 'شركة التميز', amount: 678000, status: 'pending', time: '08:12 ص', paymentMethod: 'Credit Card' },
      { id: '7', invoiceNumber: 'INV-2024-8935', customer: 'مخبز الأصيل', amount: 51200, status: 'completed', time: '07:55 ص', paymentMethod: 'Cash' },
    ]);
  });
  app.get('/api/v1/pos/sessions/branch/:id', (_req, res) => res.json([]));
  app.get('/api/v1/inventory', (_req, res) => res.json([]));
  app.get('/api/v1/accounting/trial-balance', (_req, res) => res.json({ rows: [], totalDebit: 0, totalCredit: 0, isBalanced: true }));
  app.get('/api/v1/accounting/income-statement', (_req, res) => res.json({ revenue: [], totalRevenue: 0, expenses: [], totalExpenses: 0, netIncome: 0 }));
  app.get('/api/v1/accounting/balance-sheet', (_req, res) => res.json({ assets: [], totalAssets: 0, liabilities: [], totalLiabilities: 0, equity: [], totalEquity: 0, netIncome: 0 }));
}

// ─── Serve Dashboard (Next.js) ───
const dashboardPath = path.join(__dirname, 'public', 'dashboard');
app.use('/_next', express.static(path.join(dashboardPath, '_next'), { immutable: true, maxAge: '1y' }));
app.use('/dashboard', express.static(dashboardPath));
app.get('/', (req, res, next) => {
  const indexPath = path.join(dashboardPath, 'index.html');
  if (require('fs').existsSync(indexPath)) return res.sendFile(indexPath);
  next();
});

// ─── Serve POS (Vite/React SPA) ───
const posPath = path.join(__dirname, 'public', 'pos');
app.use('/pos', express.static(posPath));
app.get('/pos/*', (_req, res) => res.sendFile(path.join(posPath, 'index.html')));

// ─── Catch-all: try dashboard, then POS ───
app.get('*', (req, res, next) => {
  const filePath = path.join(dashboardPath, req.path.slice(1) + '.html');
  if (require('fs').existsSync(filePath)) return res.sendFile(filePath);
  if (require('fs').existsSync(path.join(posPath, req.path.slice(1)))) return res.sendFile(path.join(posPath, req.path.slice(1)));
  if (require('fs').existsSync(path.join(posPath, 'index.html'))) return res.sendFile(path.join(posPath, 'index.html'));
  next();
});

// ─── 404 ───
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Prime Cloud] Production server running on port ${PORT}`);
});
