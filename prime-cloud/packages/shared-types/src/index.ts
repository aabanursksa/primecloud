// ─── Enums ───

export enum UserRole {
  OWNER = 'owner',
  ACCOUNTANT = 'accountant',
  BRANCH_MANAGER = 'branch_manager',
  CASHIER = 'cashier',
  VIEWER = 'viewer',
}

export enum OrderStatus {
  NEW = 'new',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  MADA = 'mada',
  APPLE_PAY = 'apple_pay',
  CREDIT_CARD = 'credit_card',
}

export enum POSessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum ZatcaStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLEARANCE = 'clearance',
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  FAILED = 'failed',
}

// ─── Interfaces ───

export interface JWTPayload {
  sub: string;
  tenantId: string;
  role: UserRole;
  branchId?: string;
}

export interface PosTransaction {
  id: string;
  sessionId: string;
  branchId: string;
  cashierId: string;
  type: 'sale' | 'return' | 'void';
  items: TransactionItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface TransactionItem {
  productId: string;
  nameAr: string;
  nameEn?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: ModifierSelection[];
  notes?: string;
}

export interface ModifierSelection {
  groupId: string;
  optionId: string;
  nameAr: string;
  priceAddition: number;
}

export interface ZATCAInvoice {
  uuid: string;
  invoiceCounter: number;
  previousInvoiceHash: string;
  issueDate: string;
  issueTime: string;
  invoiceType: 'SIMPLIFIED' | 'STANDARD';
  currency: 'SAR';
  lineItems: ZATCALineItem[];
  taxTotal: number;
  totalAmount: number;
  sellerInfo: SellerInfo;
  buyerInfo?: BuyerInfo;
  digitalSignature: string;
  qrCode: string;
}

export interface ZATCALineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalAmount: number;
}

export interface SellerInfo {
  name: string;
  taxNumber: string;
  crNumber?: string;
}

export interface BuyerInfo {
  name: string;
  taxNumber: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Money Helpers ───

export function toHalalas(amount: number): number {
  return Math.round(amount * 100);
}

export function fromHalalas(halalas: number): string {
  return (halalas / 100).toFixed(2);
}

export function formatSAR(halalas: number): string {
  return `${(halalas / 100).toFixed(2)} SAR`;
}
