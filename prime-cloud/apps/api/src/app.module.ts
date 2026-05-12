import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './common/prisma/prisma.module'
import { TenantMiddleware } from './common/middleware/tenant.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { TenantsModule } from './modules/tenants/tenants.module'
import { PosModule } from './modules/pos/pos.module'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { ZatcaModule } from './modules/zatca/zatca.module'
import { AccountingModule } from './modules/accounting/accounting.module'
import { ProductsModule } from './modules/products/products.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { BranchesModule } from './modules/branches/branches.module'

@Module({
  imports: [
    ThrottlerModule.forGlobal([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    TenantsModule,
    ProductsModule,
    CategoriesModule,
    BranchesModule,
    PosModule,
    InvoicesModule,
    InventoryModule,
    ZatcaModule,
    AccountingModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*')
  }
}
