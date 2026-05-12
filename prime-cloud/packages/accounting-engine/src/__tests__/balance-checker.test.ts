import { BalanceChecker } from '../balance-checker'
import type { AccountBalance } from '../ledger'

describe('BalanceChecker', () => {
  let checker: BalanceChecker

  const sampleBalances: AccountBalance[] = [
    { accountCode: '1110', nameAr: 'الصندوق', nameEn: 'Cash', type: 'asset', totalDebit: 50000, totalCredit: 20000, balance: 30000 },
    { accountCode: '1300', nameAr: 'المخزون', nameEn: 'Inventory', type: 'asset', totalDebit: 15000, totalCredit: 5000, balance: 10000 },
    { accountCode: '2200', nameAr: 'ضريبة', nameEn: 'VAT', type: 'liability', totalDebit: 0, totalCredit: 6000, balance: 6000 },
    { accountCode: '4100', nameAr: 'المبيعات', nameEn: 'Sales', type: 'revenue', totalDebit: 0, totalCredit: 50000, balance: 50000 },
    { accountCode: '5100', nameAr: 'المشتريات', nameEn: 'Purchases', type: 'expense', totalDebit: 20000, totalCredit: 0, balance: 20000 },
  ]

  beforeEach(() => {
    checker = new BalanceChecker()
  })

  describe('generateTrialBalance', () => {
    it('generates trial balance with correct totals', () => {
      const tb = checker.generateTrialBalance(sampleBalances)
      expect(tb.rows).toHaveLength(5)
      expect(tb.totalDebit).toBeGreaterThan(0)
      expect(tb.totalCredit).toBeGreaterThan(0)
    })

    it('is balanced when debits equal credits', () => {
      const tb = checker.generateTrialBalance(sampleBalances)
      expect(tb.isBalanced).toBe(true)
    })
  })

  describe('generateIncomeStatement', () => {
    it('separates revenue and expenses', () => {
      const is = checker.generateIncomeStatement(sampleBalances)
      expect(is.revenue).toHaveLength(1)
      expect(is.expenses).toHaveLength(1)
      expect(is.totalRevenue).toBe(50000)
      expect(is.totalExpenses).toBe(20000)
    })

    it('calculates net income', () => {
      const is = checker.generateIncomeStatement(sampleBalances)
      expect(is.netIncome).toBe(30000)
    })

    it('shows net loss when expenses exceed revenue', () => {
      const lossBalances = sampleBalances.map((b) =>
        b.accountCode === '4100' ? { ...b, balance: 10000 } : b,
      )
      const is = checker.generateIncomeStatement(lossBalances)
      expect(is.netIncome).toBe(-10000)
    })
  })

  describe('generateBalanceSheet', () => {
    it('includes assets, liabilities, equity, and net income', () => {
      const bs = checker.generateBalanceSheet(sampleBalances, 30000)
      expect(bs.assets.length).toBeGreaterThan(0)
      expect(bs.liabilities.length).toBeGreaterThan(0)
      expect(bs.equity.length).toBeGreaterThan(0)
    })

    it('total assets equals total liabilities plus equity', () => {
      const bs = checker.generateBalanceSheet(sampleBalances, 30000)
      expect(bs.totalAssets).toBe(bs.totalLiabilities + bs.totalEquity)
    })
  })
})
