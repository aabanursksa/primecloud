import { Module } from '@nestjs/common'
import { PosController } from './pos.controller'
import { SessionsService } from './sessions/sessions.service'
import { TransactionsService } from './transactions/transactions.service'
import { SyncService } from './sync/sync.service'

@Module({
  controllers: [PosController],
  providers: [SessionsService, TransactionsService, SyncService],
  exports: [SessionsService, TransactionsService, SyncService],
})
export class PosModule {}
