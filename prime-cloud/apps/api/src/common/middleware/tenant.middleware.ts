import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = (req as any).user?.tenantId
    if (tenantId) {
      const db = (req as any).prisma || (await import('../prisma/prisma.service'))
      try {
        // Schema-per-tenant: set search path
        await (db as any).$executeRawUnsafe(`SET search_path TO tenant_${tenantId.replace(/-/g, '_')}, public`)
        await (db as any).$executeRawUnsafe(`SET app.tenant_id = '${tenantId}'`)
      } catch {}
    }
    next()
  }
}
