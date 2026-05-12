import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    sessionId: string
    branchId: string
    cashierId: string
    items: { productId: string; quantity: number; unitPrice: number; productName: string; productNameAr: string }[]
    subtotal: number
    discountTotal: number
    taxTotal: number
    total: number
    paymentMethod: string
    note?: string
  }) {
    return this.prisma.posTransaction.create({
      data: {
        sessionId: data.sessionId,
        branchId: data.branchId,
        cashierId: data.cashierId,
        subtotal: data.subtotal,
        discountTotal: data.discountTotal,
        taxTotal: data.taxTotal,
        total: data.total,
        paymentMethod: data.paymentMethod,
        note: data.note,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productNameAr: item.productNameAr,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    })
  }

  async findBySession(sessionId: string) {
    return this.prisma.posTransaction.findMany({
      where: { sessionId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByBranch(branchId: string, limit = 50, offset = 0) {
    return this.prisma.posTransaction.findMany({
      where: { branchId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  }
}
