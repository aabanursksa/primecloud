import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    type: string
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[]
    subtotal: number
    vat: number
    total: number
    note?: string
    status?: string
  }) {
    return this.prisma.invoice.create({
      data: {
        type: data.type || 'pos',
        status: data.status || 'paid',
        subtotal: data.subtotal,
        vat: data.vat,
        total: data.total,
        note: data.note,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    })
  }

  async findAll(limit = 50, offset = 0) {
    return this.prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  }

  async findById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!invoice) throw new NotFoundException('Invoice not found')
    return invoice
  }

  async getStats() {
    const [totalRevenue, totalVat, count] = await Promise.all([
      this.prisma.invoice.aggregate({ _sum: { total: true } }),
      this.prisma.invoice.aggregate({ _sum: { vat: true } }),
      this.prisma.invoice.count(),
    ])
    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalVat: totalVat._sum.vat || 0,
      count,
    }
  }
}
