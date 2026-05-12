export { JournalEngine, UnbalancedEntryError } from './journal';
export type { JournalEntryLine, JournalEntry } from './journal';

export { Ledger } from './ledger';
export type { AccountEntry, AccountBalance } from './ledger';

export { BalanceChecker } from './balance-checker';
export type { TrialBalance, TrialBalanceRow, IncomeStatement, IncomeStatementRow, BalanceSheet, BalanceSheetSection } from './balance-checker';

export const DEFAULT_CHART_OF_ACCOUNTS: Record<string, { nameAr: string; nameEn: string; type: string }> = {
  '1000': { nameAr: 'الأصول', nameEn: 'Assets', type: 'asset' },
  '1100': { nameAr: 'النقد وما يعادله', nameEn: 'Cash & Equivalents', type: 'asset' },
  '1110': { nameAr: 'الصندوق', nameEn: 'Cash on Hand', type: 'asset' },
  '1120': { nameAr: 'البنك', nameEn: 'Bank Account', type: 'asset' },
  '1130': { nameAr: 'ذمم مدى/بطاقة', nameEn: 'Mada/Card Receivables', type: 'asset' },
  '1200': { nameAr: 'حسابات مدينة', nameEn: 'Accounts Receivable', type: 'asset' },
  '1300': { nameAr: 'المخزون', nameEn: 'Inventory', type: 'asset' },
  '1400': { nameAr: 'الضريبة القابلة للاسترداد', nameEn: 'Input VAT Recoverable', type: 'asset' },
  '2000': { nameAr: 'الخصوم', nameEn: 'Liabilities', type: 'liability' },
  '2100': { nameAr: 'حسابات دائنة', nameEn: 'Accounts Payable', type: 'liability' },
  '2200': { nameAr: 'ضريبة القيمة المضافة المستحقة', nameEn: 'VAT Payable', type: 'liability' },
  '2300': { nameAr: 'الرواتب المستحقة', nameEn: 'Accrued Salaries', type: 'liability' },
  '3000': { nameAr: 'حقوق الملكية', nameEn: 'Equity', type: 'equity' },
  '3100': { nameAr: 'رأس المال', nameEn: "Owner's Capital", type: 'equity' },
  '3200': { nameAr: 'الأرباح المبقاة', nameEn: 'Retained Earnings', type: 'equity' },
  '4000': { nameAr: 'الإيرادات', nameEn: 'Revenue', type: 'revenue' },
  '4100': { nameAr: 'إيرادات المبيعات', nameEn: 'Sales Revenue', type: 'revenue' },
  '4200': { nameAr: 'إيرادات الخدمات', nameEn: 'Service Revenue', type: 'revenue' },
  '5000': { nameAr: 'المصروفات', nameEn: 'Expenses', type: 'expense' },
  '5100': { nameAr: 'تكلفة البضاعة المباعة', nameEn: 'Cost of Goods Sold', type: 'expense' },
  '5200': { nameAr: 'الإيجار', nameEn: 'Rent', type: 'expense' },
  '5300': { nameAr: 'الرواتب', nameEn: 'Salaries', type: 'expense' },
  '5400': { nameAr: 'المرافق', nameEn: 'Utilities', type: 'expense' },
  '5500': { nameAr: 'متنوع', nameEn: 'Miscellaneous', type: 'expense' },
};

export const CHART_OF_ACCOUNTS_LIST = Object.entries(DEFAULT_CHART_OF_ACCOUNTS).map(([code, info]) => ({
  code,
  ...info,
}));
