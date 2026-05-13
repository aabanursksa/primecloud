import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async push(payload: { entityType: string; entityId: string; action: string; data: any }) {
    return this.prisma.syncQueue.create({
      data: {
        entityType: payload.entityType,
        entityId: payload.entityId,
        action: payload.action,
        payload: JSON.stringify(payload.data),
        status: 'pending',
      },
    })
  }

  async pull(since: string) {
    const sinceDate = new Date(since)
    const pending = await this.prisma.syncQueue.findMany({
      where: { createdAt: { gte: sinceDate }, status: 'pending' },
      orderBy: { createdAt: 'asc' },
    })

    // Mark as synced
    if (pending.length > 0) {
      await this.prisma.syncQueue.updateMany({
        where: { id: { in: pending.map((p: any) => p.id) } },
        data: { status: 'synced', syncedAt: new Date() },
      })
    }

    return pending.map((p: any) => ({
      id: p.id,
      entityType: p.entityType,
      entityId: p.entityId,
      action: p.action,
      payload: JSON.parse(p.payload),
      createdAt: p.createdAt.toISOString(),
    }))
  }
}
