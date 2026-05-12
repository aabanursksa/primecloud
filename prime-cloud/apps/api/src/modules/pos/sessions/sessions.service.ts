import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async open(userId: string, branchId: string) {
    const active = await this.prisma.pOSession.findFirst({
      where: { userId, status: 'open' },
    })
    if (active) throw new ForbiddenException('User already has an open session')

    return this.prisma.pOSession.create({
      data: { userId, branchId, status: 'open' },
    })
  }

  async close(id: string, userId: string) {
    const session = await this.prisma.pOSession.findUnique({ where: { id } })
    if (!session) throw new NotFoundException('Session not found')
    if (session.userId !== userId) throw new ForbiddenException('Not your session')

    return this.prisma.pOSession.update({
      where: { id },
      data: { status: 'closed', closedAt: new Date() },
    })
  }

  async findByBranch(branchId: string) {
    return this.prisma.pOSession.findMany({
      where: { branchId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { openedAt: 'desc' },
    })
  }

  async findActive(userId: string) {
    return this.prisma.pOSession.findFirst({
      where: { userId, status: 'open' },
    })
  }
}
