import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { JournalEngine } from '@prime-cloud/accounting-engine'
import { BalanceChecker } from '@prime-cloud/accounting-engine'

@Injectable()
export class AccountingService {
  private journal = new JournalEngine()
  private balanceChecker = new BalanceChecker()

  constructor(private prisma: PrismaService) {}

  async postJournalEntry(data: {
    reference?: string
    description?: string
    lines: { accountId: string; debit: number; credit: number; description?: string }[]
  }) {
    const entry = (this.journal as any).createEntry(data.lines.map((l) => ({
      accountId: l.accountId,
      debit: l.debit,
      credit: l.credit,
      description: l.description,
    })))

    const saved = await this.prisma.journalEntry.create({
      data: {
        reference: data.reference,
        description: data.description,
        lines: {
          create: entry.lines.map((l: any) => ({
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
            description: l.description,
          })),
        },
      },
      include: { lines: true },
    })

    return saved
  }

  async getTrialBalance() {
    const accounts = await this.prisma.account.findMany({ where: { isActive: true } })
    const entries = await this.prisma.journalEntryLine.findMany({
      include: { journalEntry: true, account: true },
    })

    const lines = entries.map((e: any) => ({
      accountId: e.accountId,
      accountCode: e.account.code,
      accountNameAr: e.account.nameAr,
      accountNameEn: e.account.nameEn,
      accountType: e.account.type,
      debit: e.debit,
      credit: e.credit,
    }))

    return this.balanceChecker.generateTrialBalance(lines as any)
  }

  async getIncomeStatement(startDate: string, endDate: string) {
    const entries = await this.prisma.journalEntryLine.findMany({
      where: {
        journalEntry: { date: { gte: new Date(startDate), lte: new Date(endDate) } },
      },
      include: { account: true },
    })

    const lines = entries.map((e: any) => ({
      accountId: e.accountId,
      accountCode: e.account.code,
      accountNameAr: e.account.nameAr,
      accountNameEn: e.account.nameEn,
      accountType: e.account.type,
      debit: e.debit,
      credit: e.credit,
    }))

    return this.balanceChecker.generateIncomeStatement(lines as any)
  }

  async getBalanceSheet() {
    const accounts = await this.prisma.account.findMany({ where: { isActive: true } })
    const entries = await this.prisma.journalEntryLine.findMany({
      include: { account: true },
    })

    const lines = entries.map((e: any) => ({
      accountId: e.accountId,
      accountCode: e.account.code,
      accountNameAr: e.account.nameAr,
      accountNameEn: e.account.nameEn,
      accountType: e.account.type,
      debit: e.debit,
      credit: e.credit,
    }))

    return this.balanceChecker.generateBalanceSheet(lines as any, 0)
  }
}
