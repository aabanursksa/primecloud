export interface JournalEntryLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  description: string;
  lines: JournalEntryLine[];
  createdAt: string;
  postedAt: string;
  isReversed: boolean;
  reversedById?: string;
}

export class UnbalancedEntryError extends Error {
  constructor(debits: number, credits: number) {
    super(`Unbalanced entry: Debits (${debits}) ≠ Credits (${credits})`);
    this.name = 'UnbalancedEntryError';
  }
}

export class JournalEngine {
  validateEntry(lines: JournalEntryLine[]): void {
    const debits = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const credits = lines.reduce((sum, l) => sum + (l.credit || 0), 0);

    if (debits !== credits) {
      throw new UnbalancedEntryError(debits, credits);
    }
  }

  createSaleEntry(
    invoiceNumber: string,
    total: number,
    subtotal: number,
    taxTotal: number,
  ): JournalEntry {
    const lines: JournalEntryLine[] = [
      { accountCode: '1110', debit: total, credit: 0 },
      { accountCode: '4100', debit: 0, credit: subtotal },
      { accountCode: '2200', debit: 0, credit: taxTotal },
    ];

    this.validateEntry(lines);

    return {
      id: crypto.randomUUID(),
      description: `بيع — ${invoiceNumber}`,
      lines,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      isReversed: false,
    };
  }

  createPaymentEntry(
    invoiceNumber: string,
    total: number,
    paymentMethod: string,
  ): JournalEntry {
    const cashAccount = paymentMethod === 'cash' ? '1110'
      : paymentMethod === 'mada' ? '1130'
      : paymentMethod === 'apple_pay' ? '1130'
      : '1120';

    const lines: JournalEntryLine[] = [
      { accountCode: cashAccount, debit: total, credit: 0 },
      { accountCode: '1200', debit: 0, credit: total },
    ];

    this.validateEntry(lines);

    return {
      id: crypto.randomUUID(),
      description: `تحصيل — ${invoiceNumber}`,
      lines,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      isReversed: false,
    };
  }

  createPurchaseEntry(
    poNumber: string,
    total: number,
    taxTotal: number,
  ): JournalEntry {
    const lines: JournalEntryLine[] = [
      { accountCode: '1300', debit: total - taxTotal, credit: 0 },
      { accountCode: '2200', debit: taxTotal, credit: 0 },
      { accountCode: '2100', debit: 0, credit: total },
    ];

    this.validateEntry(lines);

    return {
      id: crypto.randomUUID(),
      description: `مشتريات — ${poNumber}`,
      lines,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      isReversed: false,
    };
  }

  createExpenseEntry(
    description: string,
    amount: number,
    accountCode: string,
    paidFromAccount: string = '1110',
  ): JournalEntry {
    const lines: JournalEntryLine[] = [
      { accountCode, debit: amount, credit: 0 },
      { accountCode: paidFromAccount, debit: 0, credit: amount },
    ];

    this.validateEntry(lines);

    return {
      id: crypto.randomUUID(),
      description,
      lines,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      isReversed: false,
    };
  }

  reverseEntry(original: JournalEntry): JournalEntry {
    const reversedLines = original.lines.map((l) => ({
      accountCode: l.accountCode,
      debit: l.credit,
      credit: l.debit,
    }));

    return {
      id: crypto.randomUUID(),
      description: `عكس — ${original.description}`,
      lines: reversedLines,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      isReversed: true,
      reversedById: original.id,
    };
  }
}
