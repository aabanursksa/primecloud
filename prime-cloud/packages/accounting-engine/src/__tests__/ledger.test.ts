import { Ledger } from '../ledger'
import { JournalEngine } from '../journal'

const chartOfAccounts = {
  '1110': { nameAr: 'الصندوق', nameEn: 'Cash on Hand', type: 'asset' },
  '1120': { nameAr: 'البنك', nameEn: 'Bank Account', type: 'asset' },
  '1300': { nameAr: 'المخزون', nameEn: 'Inventory', type: 'asset' },
  '2100': { nameAr: 'حسابات دائنة', nameEn: 'Accounts Payable', type: 'liability' },
  '2200': { nameAr: 'ضريبة القيمة المضافة', nameEn: 'VAT Payable', type: 'liability' },
  '3100': { nameAr: 'رأس المال', nameEn: "Owner's Capital", type: 'equity' },
  '4100': { nameAr: 'إيرادات المبيعات', nameEn: 'Sales Revenue', type: 'revenue' },
  '5100': { nameAr: 'تكلفة البضاعة', nameEn: 'COGS', type: 'expense' },
  '5200': { nameAr: 'الإيجار', nameEn: 'Rent', type: 'expense' },
}

describe('Ledger', () => {
  let ledger: Ledger
  let journal: JournalEngine

  beforeEach(() => {
    ledger = new Ledger()
    journal = new JournalEngine()
  })

  describe('postEntry', () => {
    it('converts journal entry to account entries', () => {
      const entry = journal.createSaleEntry('INV-001', 1150, 1000, 150)
      const posted = ledger.postEntry(entry)

      expect(posted).toHaveLength(3)
      expect(posted[0].entryId).toBe(entry.id)
      expect(posted[0].description).toBe(entry.description)
    })

    it('calculates balance for each line', () => {
      const entry = journal.createExpenseEntry('Rent', 5000, '5200')
      const posted = ledger.postEntry(entry)

      expect(posted[0].balance).toBe(5000)
      expect(posted[1].balance).toBe(-5000)
    })
  })

  describe('calculateBalances', () => {
    it('returns empty for no entries', () => {
      const balances = ledger.calculateBalances([], chartOfAccounts)
      expect(balances).toEqual([])
    })

    it('aggregates multiple entries for same account', () => {
      const e1 = journal.createSaleEntry('INV-001', 1150, 1000, 150)
      const e2 = journal.createSaleEntry('INV-002', 2300, 2000, 300)
      const posted = [...ledger.postEntry(e1), ...ledger.postEntry(e2)]

      const balances = ledger.calculateBalances(posted, chartOfAccounts)
      const cashBalance = balances.find((b) => b.accountCode === '1110')
      expect(cashBalance!.totalDebit).toBe(3450)
    })

    it('sorts by account code', () => {
      const entry = journal.createSaleEntry('INV-001', 1150, 1000, 150)
      const posted = ledger.postEntry(entry)
      const balances = ledger.calculateBalances(posted, chartOfAccounts)

      expect(balances[0].accountCode).toBe('1110')
      expect(balances[1].accountCode).toBe('2200')
      expect(balances[2].accountCode).toBe('4100')
    })

    it('computes correct balance for asset accounts', () => {
      const entry = journal.createExpenseEntry('Rent', 5000, '5200')
      const posted = ledger.postEntry(entry)
      const balances = ledger.calculateBalances(posted, chartOfAccounts)

      const expenseBalance = balances.find((b) => b.accountCode === '5200')
      expect(expenseBalance!.balance).toBe(5000)
    })

    it('computes correct balance for liability accounts', () => {
      const entry = journal.createSaleEntry('INV-001', 1150, 1000, 150)
      const posted = ledger.postEntry(entry)
      const balances = ledger.calculateBalances(posted, chartOfAccounts)

      const vatBalance = balances.find((b) => b.accountCode === '2200')
      expect(vatBalance!.balance).toBe(150)
    })
  })
})
