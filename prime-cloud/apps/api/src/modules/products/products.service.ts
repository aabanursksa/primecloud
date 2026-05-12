import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; nameAr: string; price: number; barcode?: string; cost?: number; categoryId?: string }) {
    return this.prisma.product.create({ data })
  }

  async findAll(limit = 500, offset = 0) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { category: true } })
    if (!product) throw new NotFoundException('Product not found')
    return product
  }

  async update(id: string, data: Partial<{ name: string; nameAr: string; price: number; barcode: string; cost: number; categoryId: string; isActive: boolean }>) {
    await this.findById(id)
    return this.prisma.product.update({ where: { id }, data })
  }

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameAr: { contains: query } },
          { barcode: { contains: query } },
        ],
      },
      include: { category: true },
      take: 20,
    })
  }
}
