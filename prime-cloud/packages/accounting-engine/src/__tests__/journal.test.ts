import { JournalEngine, UnbalancedEntryError } from '../journal'

describe('JournalEngine', () => {
  let engine: JournalEngine

  beforeEach(() => {
    engine = new JournalEngine()
  })

  describe('validateEntry', () => {
    it('passes for balanced entry', () => {
      expect(() =>
        engine.validateEntry([
          { accountCode: '1110', debit: 1000, credit: 0 },
          { accountCode: '4100', debit: 0, credit: 1000 },
        ]),
      ).not.toThrow()
    })

    it('throws UnbalancedEntryError for unbalanced entry', () => {
      expect(() =>
        engine.validateEntry([
          { accountCode: '1110', debit: 1000, credit: 0 },
          { accountCode: '4100', debit: 0, credit: 500 },
        ]),
      ).toThrow(UnbalancedEntryError)
    })

    it('throws with correct message', () => {
      expect(() =>
        engine.validateEntry([
          { accountCode: '1110', debit: 100, credit: 0 },
          { accountCode: '4100', debit: 0, credit: 50 },
        ]),
      ).toThrow(/100.*50/)
    })
  })

  describe('createSaleEntry', () => {
    it('creates balanced sale entry', () => {
      const entry = engine.createSaleEntry('INV-001', 1150, 1000, 150)
      expect(entry.description).toContain('INV-001')
      expect(entry.lines).toHaveLength(3)
      expect(entry.isReversed).toBe(false)

      const debits = entry.lines.reduce((s, l) => s + l.debit, 0)
      const credits = entry.lines.reduce((s, l) => s + l.credit, 0)
      expect(debits).toBe(credits)
    })

    it('includes cash, revenue, and VAT accounts', () => {
      const entry = engine.createSaleEntry('INV-002', 2300, 2000, 300)
      const codes = entry.lines.map((l) => l.accountCode)
      expect(codes).toContain('1110')
      expect(codes).toContain('4100')
      expect(codes).toContain('2200')
    })
  })

  describe('createPaymentEntry', () => {
    it('uses cash account for cash payments', () => {
      const entry = engine.createPaymentEntry('INV-001', 1000, 'cash')
      expect(entry.lines[0].accountCode).toBe('1110')
    })

    it('uses card receivables for mada payments', () => {
      const entry = engine.createPaymentEntry('INV-002', 1000, 'mada')
      expect(entry.lines[0].accountCode).toBe('1130')
    })

    it('uses bank account for other methods', () => {
      const entry = engine.createPaymentEntry('INV-003', 1000, 'bank_transfer')
      expect(entry.lines[0].accountCode).toBe('1120')
    })

    it('creates balanced entry', () => {
      const entry = engine.createPaymentEntry('INV-004', 500, 'cash')
      const debits = entry.lines.reduce((s, l) => s + l.debit, 0)
      const credits = entry.lines.reduce((s, l) => s + l.credit, 0)
      expect(debits).toBe(credits)
    })
  })

  describe('createPurchaseEntry', () => {
    it('creates balanced purchase entry', () => {
      const entry = engine.createPurchaseEntry('PO-001', 1150, 150)
      const debits = entry.lines.reduce((s, l) => s + l.debit, 0)
      const credits = entry.lines.reduce((s, l) => s + l.credit, 0)
      expect(debits).toBe(credits)
    })

    it('includes inventory, VAT, and AP accounts', () => {
      const entry = engine.createPurchaseEntry('PO-002', 1150, 150)
      const codes = entry.lines.map((l) => l.accountCode)
      expect(codes).toContain('1300')
      expect(codes).toContain('2200')
      expect(codes).toContain('2100')
    })
  })

  describe('createExpenseEntry', () => {
    it('creates balanced expense entry', () => {
      const entry = engine.createExpenseEntry('Rent payment', 5000, '5200')
      const debits = entry.lines.reduce((s, l) => s + l.debit, 0)
      const credits = entry.lines.reduce((s, l) => s + l.credit, 0)
      expect(debits).toBe(credits)
    })

    it('defaults to cash account', () => {
      const entry = engine.createExpenseEntry('Utilities', 2000, '5400')
      expect(entry.lines[1].accountCode).toBe('1110')
    })

    it('uses specified paid-from account', () => {
      const entry = engine.createExpenseEntry('Software', 1000, '5500', '1120')
      expect(entry.lines[1].accountCode).toBe('1120')
    })
  })

  describe('reverseEntry', () => {
    it('reverses debits and credits', () => {
      const original = engine.createSaleEntry('INV-001', 1150, 1000, 150)
      const reversed = engine.reverseEntry(original)

      expect(reversed.isReversed).toBe(true)
      expect(reversed.reversedById).toBe(original.id)
      expect(reversed.lines[0].debit).toBe(original.lines[0].credit)
      expect(reversed.lines[0].credit).toBe(original.lines[0].debit)
    })

    it('creates balanced reversal', () => {
      const original = engine.createSaleEntry('INV-005', 1000, 870, 130)
      const reversed = engine.reverseEntry(original)
      const debits = reversed.lines.reduce((s, l) => s + l.debit, 0)
      const credits = reversed.lines.reduce((s, l) => s + l.credit, 0)
      expect(debits).toBe(credits)
    })
  })
})
