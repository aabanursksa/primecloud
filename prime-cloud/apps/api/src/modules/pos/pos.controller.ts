import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { SessionsService } from './sessions/sessions.service'
import { TransactionsService } from './transactions/transactions.service'
import { SyncService } from './sync/sync.service'

@Controller('pos')
@UseGuards(JwtAuthGuard)
export class PosController {
  constructor(
    private sessions: SessionsService,
    private transactions: TransactionsService,
    private sync: SyncService,
  ) {}

  @Post('sessions/open')
  async openSession(@CurrentUser() user: any, @Body() body: { branchId: string }) {
    return this.sessions.open(user.id, body.branchId)
  }

  @Post('sessions/:id/close')
  async closeSession(@Param('id') id: string, @CurrentUser() user: any) {
    return this.sessions.close(id, user.id)
  }

  @Get('sessions/active')
  async getActiveSession(@CurrentUser() user: any) {
    return this.sessions.findActive(user.id)
  }

  @Get('sessions/branch/:branchId')
  async getSessionsByBranch(@Param('branchId') branchId: string) {
    return this.sessions.findByBranch(branchId)
  }

  @Post('transactions')
  async createTransaction(@CurrentUser() user: any, @Body() body: any) {
    return this.transactions.create({
      ...body,
      cashierId: user.id,
    })
  }

  @Get('transactions/session/:sessionId')
  async getTransactionsBySession(@Param('sessionId') sessionId: string) {
    return this.transactions.findBySession(sessionId)
  }

  @Get('transactions/branch/:branchId')
  async getTransactionsByBranch(
    @Param('branchId') branchId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.transactions.findByBranch(branchId, Number(limit) || 50, Number(offset) || 0)
  }

  @Post('sync/push')
  async pushSync(@Body() body: { entityType: string; entityId: string; action: string; data: any }) {
    return this.sync.push(body)
  }

  @Get('sync/pull')
  async pullSync(@Query('since') since: string) {
    return this.sync.pull(since || new Date(0).toISOString())
  }
}
