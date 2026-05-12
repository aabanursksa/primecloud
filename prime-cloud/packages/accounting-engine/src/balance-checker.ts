import type { AccountBalance } from './ledger';

export interface TrialBalanceRow {
  accountCode: string;
  nameAr: string;
  nameEn: string;
  type: string;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  rows: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface IncomeStatementRow {
  accountCode: string;
  nameAr: string;
  nameEn: string;
  amount: number;
}

export interface IncomeStatement {
  revenue: IncomeStatementRow[];
  totalRevenue: number;
  expenses: IncomeStatementRow[];
  totalExpenses: number;
  netIncome: number;
}

export interface BalanceSheetSection {
  accountCode: string;
  nameAr: string;
  nameEn: string;
  amount: number;
}

export interface BalanceSheet {
  assets: BalanceSheetSection[];
  totalAssets: number;
  liabilities: BalanceSheetSection[];
  totalLiabilities: number;
  equity: BalanceSheetSection[];
  totalEquity: number;
  netIncome: number;
}

export class BalanceChecker {
  generateTrialBalance(accountBalances: AccountBalance[]): TrialBalance {
    let totalDebit = 0;
    let totalCredit = 0;

    const rows: TrialBalanceRow[] = accountBalances.map((acc) => {
      const debit = acc.balance > 0 ? acc.balance : 0;
      const credit = acc.balance < 0 ? Math.abs(acc.balance) : 0;

      if (acc.type === 'asset' || acc.type === 'expense') {
        totalDebit += debit;
        totalCredit += credit;
      } else {
        totalDebit += debit;
        totalCredit += credit;
      }

      return {
        accountCode: acc.accountCode,
        nameAr: acc.nameAr,
        nameEn: acc.nameEn,
        type: acc.type,
        debit,
        credit,
      };
    });

    const actualDebit = rows.reduce((s, r) => s + r.debit, 0);
    const actualCredit = rows.reduce((s, r) => s + r.credit, 0);

    return {
      rows,
      totalDebit: actualDebit,
      totalCredit: actualCredit,
      isBalanced: actualDebit === actualCredit,
    };
  }

  generateIncomeStatement(accountBalances: AccountBalance[]): IncomeStatement {
    const revenue: IncomeStatementRow[] = [];
    const expenses: IncomeStatementRow[] = [];

    for (const acc of accountBalances) {
      if (acc.type === 'revenue') {
        revenue.push({
          accountCode: acc.accountCode,
          nameAr: acc.nameAr,
          nameEn: acc.nameEn,
          amount: acc.balance,
        });
      } else if (acc.type === 'expense') {
        expenses.push({
          accountCode: acc.accountCode,
          nameAr: acc.nameAr,
          nameEn: acc.nameEn,
          amount: acc.balance,
        });
      }
    }

    const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);

    return {
      revenue,
      totalRevenue,
      expenses,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }

  generateBalanceSheet(
    accountBalances: AccountBalance[],
    netIncome: number,
  ): BalanceSheet {
    const assets: BalanceSheetSection[] = [];
    const liabilities: BalanceSheetSection[] = [];
    const equity: BalanceSheetSection[] = [];

    for (const acc of accountBalances) {
      const amount = Math.abs(acc.balance);
      const section = {
        accountCode: acc.accountCode,
        nameAr: acc.nameAr,
        nameEn: acc.nameEn,
        amount,
      };

      switch (acc.type) {
        case 'asset':
          assets.push(section);
          break;
        case 'liability':
          liabilities.push(section);
          break;
        case 'equity':
          equity.push(section);
          break;
      }
    }

    equity.push({
      accountCode: 'NET',
      nameAr: 'صافي الدخل',
      nameEn: 'Net Income',
      amount: netIncome > 0 ? netIncome : 0,
    });

    if (netIncome < 0) {
      equity.push({
        accountCode: 'NET_LOSS',
        nameAr: 'صافي الخسارة',
        nameEn: 'Net Loss',
        amount: Math.abs(netIncome),
      });
    }

    const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
    const totalEquity = equity.reduce((s, e) => s + e.amount, 0);

    return {
      assets,
      totalAssets,
      liabilities,
      totalLiabilities,
      equity,
      totalEquity,
      netIncome,
    };
  }
}
