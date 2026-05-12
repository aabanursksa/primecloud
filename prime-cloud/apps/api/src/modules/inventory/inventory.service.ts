import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async upsert(productId: string, quantity: number) {
    const existing = await this.prisma.inventory.findUnique({ where: { productId } })
    if (existing) {
      return this.prisma.inventory.update({
        where: { productId },
        data: { quantity },
      })
    }
    return this.prisma.inventory.create({ data: { productId, quantity } })
  }

  async adjust(productId: string, delta: number) {
    const inv = await this.prisma.inventory.findUnique({ where: { productId } })
    if (!inv) throw new NotFoundException('Inventory record not found')
    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity: inv.quantity + delta },
    })
  }

  async findByProduct(productId: string) {
    const inv = await this.prisma.inventory.findUnique({ where: { productId } })
    if (!inv) throw new NotFoundException('Inventory record not found')
    return inv
  }

  async findAll() {
    return this.prisma.inventory.findMany({
      include: { product: true },
      orderBy: { updatedAt: 'desc' },
    })
  }
}
