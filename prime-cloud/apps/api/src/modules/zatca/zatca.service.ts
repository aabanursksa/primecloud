import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class ZatcaService {
  constructor(private prisma: PrismaService) {}

  async submit(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } })
    if (!invoice) throw new NotFoundException('Invoice not found')

    // In production: build XML, sign, chain hash, generate QR, submit to ZATCA API
    const submission = await this.prisma.zatcaSubmission.create({
      data: {
        invoiceId,
        status: 'pending',
      },
    })

    // Simulate acceptance for dev
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { zatcaStatus: 'accepted', zatcaUuid: crypto.randomUUID() },
    })

    await this.prisma.zatcaSubmission.update({
      where: { id: submission.id },
      data: { status: 'accepted', submittedAt: new Date() },
    })

    return { submissionId: submission.id, status: 'accepted' }
  }

  async getStatus(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } })
    if (!invoice) throw new NotFoundException('Invoice not found')
    return { zatcaStatus: invoice.zatcaStatus, zatcaUuid: invoice.zatcaUuid }
  }

  async getSubmissions(limit = 50) {
    return this.prisma.zatcaSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}
