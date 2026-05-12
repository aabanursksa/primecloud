import type { JournalEntry, JournalEntryLine } from './journal';

export interface AccountEntry {
  accountCode: string;
  debit: number;
  credit: number;
  balance: number;
  description: string;
  entryId: string;
  postedAt: string;
}

export interface AccountBalance {
  accountCode: string;
  nameAr: string;
  nameEn: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export class Ledger {
  postEntry(entry: JournalEntry): AccountEntry[] {
    return entry.lines.map((line: JournalEntryLine) => ({
      accountCode: line.accountCode,
      debit: line.debit,
      credit: line.credit,
      balance: line.debit - line.credit,
      description: entry.description,
      entryId: entry.id,
      postedAt: entry.postedAt,
    }));
  }

  calculateBalances(
    entries: AccountEntry[],
    chartOfAccounts: Record<string, { nameAr: string; nameEn: string; type: string }>,
  ): AccountBalance[] {
    const balances = new Map<string, { debit: number; credit: number }>();

    for (const entry of entries) {
      const current = balances.get(entry.accountCode) || { debit: 0, credit: 0 };
      current.debit += entry.debit;
      current.credit += entry.credit;
      balances.set(entry.accountCode, current);
    }

    const result: AccountBalance[] = [];

    for (const [accountCode, { debit, credit }] of balances) {
      const info = chartOfAccounts[accountCode];
      const balance = this.computeBalance(debit, credit, info?.type || 'asset');

      result.push({
        accountCode,
        nameAr: info?.nameAr || '',
        nameEn: info?.nameEn || '',
        type: (info?.type as AccountBalance['type']) || 'asset',
        totalDebit: debit,
        totalCredit: credit,
        balance,
      });
    }

    return result.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  private computeBalance(debit: number, credit: number, type: string): number {
    switch (type) {
      case 'asset':
      case 'expense':
        return debit - credit;
      case 'liability':
      case 'equity':
      case 'revenue':
        return credit - debit;
      default:
        return debit - credit;
    }
  }
}
