# .opencode.md — Prime Cloud SaaS Platform
# يُقرأ هذا الملف تلقائياً بواسطة OpenCode في كل جلسة
# --------------------------------------------------------

## هوية المشروع

```yaml
name: Prime Cloud
type: SaaS Multi-Tenant
domain: محاسبة سحابية + نقاط بيع (POS)
market: المملكة العربية السعودية
compliance: ZATCA (الفواتير الإلكترونية) + PDPL
scale:
  tenants: 5,000+ شهرياً
  pos_devices: 10,000+ متزامن
  tps: 50,000 معاملة/ثانية
  sla: 99.99% uptime
```

---

## Tech Stack — لا تبدّل بدون موافقة

```yaml
backend:
  runtime: Node.js 20 LTS
  language: TypeScript 5.x (strict: true)
  framework: NestJS 10.x
  orm: Prisma 5.x
  database: PostgreSQL 16
  cache: Redis 7 (Cluster)
  queue: BullMQ + Redis
  websocket: Socket.io 4.x + Redis Adapter
  auth: JWT (15min) + Refresh (7d) + Keycloak
  search: Elasticsearch 8.x
  storage: AWS S3
  email: AWS SES

frontend_dashboard:
  framework: Next.js 14 (App Router)
  language: TypeScript (strict)
  state: Zustand + TanStack Query v5
  ui: shadcn/ui + Tailwind CSS
  charts: Recharts + Tremor
  pdf: React-PDF
  direction: RTL دائماً

frontend_pos:
  framework: React 18 + Vite
  desktop: Tauri 2.x
  local_db: SQLite (better-sqlite3)
  offline_sync: Yjs (CRDT) + Dexie.js
  queue: BullMQ local → Cloud
  fallback: PWA (Vite PWA Plugin)

infrastructure:
  primary_cloud: AWS (me-south-1)
  dr_cloud: GCP (eu-west-1)
  containers: Docker + Kubernetes (EKS)
  ci_cd: GitHub Actions + ArgoCD
  monitoring: Datadog APM + Sentry
  iac: Terraform
  secrets: AWS Secrets Manager
  cdn: CloudFront + S3
```

---

## معمارية قاعدة البيانات

### استراتيجية العزل: Schema-per-Tenant

```
PostgreSQL
├── Schema: public (مشترك)
│   ├── tenants
│   ├── plans
│   └── tenant_users
│
└── Schema: tenant_{uuid} (لكل عميل)
    ├── accounts           ← دليل الحسابات
    ├── journal_entries    ← اليومية
    ├── ledger_entries     ← دفتر الأستاذ
    ├── invoices
    ├── invoice_items
    ├── products
    ├── pos_sessions
    ├── pos_transactions
    ├── sync_queue         ← طابور المزامنة الأوفلاين
    ├── zatca_submissions
    ├── branches
    └── inventory
```

### Row-Level Security — إلزامي على كل جدول
```sql
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON public.tenants
  USING (id = current_setting('app.tenant_id')::uuid);
```

### TenantMiddleware — يُطبَّق على كل Request
```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = extractTenantFromJWT(req); // من JWT فقط — لا من body
    await db.$executeRaw`SET search_path TO tenant_${tenantId}, public`;
    await db.$executeRaw`SET app.tenant_id = '${tenantId}'`;
    next();
  }
}
```

---

## Offline-First POS — القواعد الذهبية

> **المبدأ: POS يعمل بكامل وظائفه بدون إنترنت. الاتصال ميزة، ليس شرطاً.**

```yaml
rules:
  - كل بيع يُحفظ في SQLite المحلي أولاً ثم السحابة
  - UUID يُولَّد محلياً دائماً (crypto.randomUUID())
  - الطابعة تعمل محلياً بدون أي API call
  - فحص الاتصال: كل 5 ثوانٍ (Heartbeat)
  - حد أوفلاين: 72 ساعة (بعدها تحذير للمستخدم)
  - بدء المزامنة: خلال 3 ثوانٍ من استعادة الاتصال
  - هدف المزامنة: أقل من 30 ثانية لـ 8 ساعات عمل

conflict_resolution:
  default: Last-Write-Wins (بالـ timestamp)
  inventory_exception: |
    إذا بيع عنصر أوفلاين + أونلاين في نفس الوقت:
    1. قبول كلا البيعتين
    2. تسجيل رصيد سالب
    3. إشعار فوري لمدير المخزون
    4. لا إلغاء تلقائي بدون تدخل بشري
```

### SQLite Schema المحلي (POS)
```sql
CREATE TABLE local_transactions (
  id            TEXT PRIMARY KEY,  -- UUID محلي
  tenant_id     TEXT NOT NULL,
  branch_id     TEXT NOT NULL,
  data          TEXT NOT NULL,     -- JSON كامل
  synced        INTEGER DEFAULT 0, -- 0=معلق 1=متزامن
  sync_attempts INTEGER DEFAULT 0,
  created_at    INTEGER NOT NULL,  -- Unix timestamp
  synced_at     INTEGER
);

CREATE TABLE local_products (
  id         TEXT PRIMARY KEY,
  data       TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  version    INTEGER DEFAULT 1   -- CRDT version
);
```

---

## ZATCA — متطلبات إلزامية

### مسار كل فاتورة
```
إتمام البيع
    ↓
بناء XML (UBL 2.1)
    ↓
توقيع رقمي (CSID) ← XML-DSig
    ↓
Chain Hash (ربط بالفاتورة السابقة)
    ↓
توليد QR Code (TLV Encoding Base64)
    ↓
هل الاتصال متاح؟
    ├── نعم → إرسال ZATCA API فوراً
    │         ← رد: قبول / رفض / Clearance
    │         ← حفظ رقم الاستجابة
    └── لا  → حفظ في sync_queue (BullMQ)
              ← إرسال عند عودة الاتصال
              ← طباعة إيصال بـ "في انتظار التحقق"
```

### Endpoints
```
Sandbox:    https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal
Production: https://gw-fatoora.zatca.gov.sa/e-invoicing/core

POST /invoices/reporting/single   ← Simplified Invoice
POST /invoices/clearance/single   ← Standard Invoice (> 1000 SAR)
```

### Interface الفاتورة
```typescript
interface ZATCAInvoice {
  uuid: string;
  invoiceCounter: number;
  previousInvoiceHash: string;        // Chaining
  issueDate: string;                  // YYYY-MM-DD
  issueTime: string;                  // HH:MM:SS
  invoiceType: 'SIMPLIFIED' | 'STANDARD';
  currency: 'SAR';
  lineItems: ZATCALineItem[];
  taxTotal: number;                   // 15% VAT
  totalAmount: number;
  sellerInfo: SellerInfo;
  buyerInfo?: BuyerInfo;             // مطلوب للـ Standard
  digitalSignature: string;          // XML-DSig
  qrCode: string;                     // TLV Base64
}
```

---

## هيكل المجلدات

```
prime-cloud/
├── apps/
│   ├── api/                     # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenants/
│   │   │   │   ├── accounting/
│   │   │   │   │   ├── journal/
│   │   │   │   │   ├── ledger/
│   │   │   │   │   └── reports/
│   │   │   │   ├── pos/
│   │   │   │   │   ├── sessions/
│   │   │   │   │   ├── transactions/
│   │   │   │   │   └── sync/
│   │   │   │   ├── inventory/
│   │   │   │   ├── invoices/
│   │   │   │   └── zatca/
│   │   │   └── common/
│   │   │       ├── middleware/   # TenantMiddleware
│   │   │       ├── guards/
│   │   │       ├── decorators/
│   │   │       └── pipes/
│   │   └── prisma/schema.prisma
│   ├── dashboard/               # Next.js 14
│   │   └── app/
│   │       ├── (auth)/
│   │       └── (dashboard)/
│   │           ├── accounting/
│   │           ├── pos/
│   │           ├── inventory/
│   │           └── reports/
│   └── pos/                     # Tauri + React
│       ├── src/
│       │   ├── screens/
│       │   ├── db/              # SQLite
│       │   ├── sync/            # Offline engine
│       │   └── zatca/           # Local signing
│       └── src-tauri/
├── packages/
│   ├── shared-types/            # TypeScript types مشتركة
│   ├── zatca-sdk/               # ZATCA مكتبة مستقلة
│   ├── accounting-engine/       # محرك القيد المزدوج
│   └── ui/                      # shadcn components
├── infrastructure/
│   ├── terraform/
│   ├── kubernetes/
│   └── docker/
├── docs/
│   ├── PRD.md
│   ├── API.md
│   └── ADRs/
├── .opencode.md                 ← هذا الملف
├── CLAUDE.md
├── .cursorrules
├── turbo.json
└── package.json
```

---

## أوامر التطوير

```bash
pnpm install              # تثبيت كل شيء
pnpm dev                  # تشغيل كل الخدمات
pnpm --filter api dev     # API فقط
pnpm --filter dashboard dev  # Dashboard فقط
pnpm --filter pos dev     # POS فقط
pnpm --filter api prisma:migrate  # Migrations
pnpm test                 # Unit tests
pnpm test:e2e             # E2E tests
pnpm lint && pnpm typecheck  # جودة الكود
pnpm build                # Build كامل
```

---

## متغيرات البيئة

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/primecloud
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
KEYCLOAK_URL=
KEYCLOAK_REALM=primecloud
KEYCLOAK_CLIENT_ID=

# AWS
AWS_REGION=me-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=primecloud-files
SES_FROM_EMAIL=noreply@primecloud.sa

# ZATCA
ZATCA_ENV=sandbox
ZATCA_API_URL=https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal
ZATCA_CERT_PATH=./certs/zatca.pem

# Monitoring
DATADOG_API_KEY=
SENTRY_DSN=
```

---

## قواعد الكود — اتبعها دائماً

### ✅ افعل
```typescript
// 1. Tenant من JWT فقط
const tenantId = req.user.tenantId; // ✅

// 2. أموال كـ integer (هللات)
const amount = Math.round(1150.00 * 100); // 115000 ✅

// 3. Soft delete للبيانات المالية
await prisma.invoice.update({ data: { deletedAt: new Date() } }); // ✅

// 4. UUID محلي في POS
const id = crypto.randomUUID(); // ✅ لا تنتظر السحابة

// 5. Double-Entry دائماً
// sum(debit) === sum(credit) في كل قيد ✅
```

### ❌ لا تفعل
```typescript
// 1. Tenant من الـ body
const tenantId = req.body.tenantId; // ❌

// 2. Float للأموال
const amount = 1150.00; // ❌ أخطاء تقريب

// 3. Hard delete
await prisma.invoice.delete({ where: { id } }); // ❌

// 4. API call في POS بدون fallback أوفلاين
const res = await api.post('/sale', data); // ❌ يفشل أوفلاين

// 5. إرسال ZATCA بدون توقيع
await zatca.submit(rawXml); // ❌
```

---

## معايير الأداء — تنبّه عند التجاوز

```
POS أونلاين:    < 150ms p95
POS أوفلاين:   < 50ms p95
API عام:        < 200ms p95
Dashboard:      < 2s (LCP)
DB Query:       < 100ms
مزامنة أوفلاين: < 30s / 8h عمل
ZATCA إرسال:    < 2s
```

---

## محظورات مطلقة

```
❌ لا secrets في الكود أو Git
❌ لا any في TypeScript
❌ لا raw SQL خارج migrations
❌ لا حذف بيانات مالية (soft delete فقط)
❌ لا تغيير Tech Stack بدون ADR
❌ لا إرسال ZATCA بدون توقيع رقمي
❌ لا افتراض إنترنت في كود POS
❌ لا tenant_id من الـ URL أو body
```

---

## اللغة والتوطين

```yaml
ui_language: Arabic (العربية)
direction: RTL (dir="rtl" على كل container)
timezone: Asia/Riyadh (UTC+3)
db_timezone: UTC دائماً في قاعدة البيانات
currency: SAR (ريال سعودي)
currency_storage: integer (هللات × 100)
vat_rate: 15%
vat_storage: منفصل عن السعر الأساسي
date_format: YYYY-MM-DD (ISO 8601)
```

---

## دورة عمل OpenCode في هذا المشروع

```
1. اقرأ .opencode.md (أنت تفعل ذلك الآن ✓)
2. حدّد الـ module المرتبط بالمهمة
3. تحقق من ADR المرتبط في docs/ADRs/
4. اكتب Tests أولاً (TDD)
5. نفّذ الكود مع التزام الـ patterns أعلاه
6. شغّل: pnpm lint && pnpm typecheck && pnpm test
7. تأكد أن الأداء ضمن الحدود المحددة
```

---

*Prime Cloud Engineering | v1.0.0 | مايو 2026*
