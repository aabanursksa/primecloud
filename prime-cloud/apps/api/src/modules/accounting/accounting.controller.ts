import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common'
import { AccountingService } from './accounting.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private accountingService: AccountingService) {}

  @Post('journal')
  async postJournalEntry(@Body() body: {
    reference?: string
    description?: string
    lines: { accountId: string; debit: number; credit: number; description?: string }[]
  }) {
    return this.accountingService.postJournalEntry(body)
  }

  @Get('trial-balance')
  async getTrialBalance() {
    return this.accountingService.getTrialBalance()
  }

  @Get('income-statement')
  async getIncomeStatement(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.accountingService.getIncomeStatement(startDate, endDate)
  }

  @Get('balance-sheet')
  async getBalanceSheet() {
    return this.accountingService.getBalanceSheet()
  }
}
