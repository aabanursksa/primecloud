import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; slug: string; plan?: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: data.slug } })
    if (existing) throw new ConflictException('Tenant slug already exists')

    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        plan: data.plan || 'free',
      },
    })

    // Create tenant schema and seed chart of accounts
    const schemaName = `tenant_${tenant.id.replace(/-/g, '_')}`
    await this.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)

    return tenant
  }

  async findAll() {
    return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } })
    if (!tenant) throw new NotFoundException('Tenant not found')
    return tenant
  }

  async update(id: string, data: { name?: string; plan?: string; isActive?: boolean }) {
    await this.findById(id)
    return this.prisma.tenant.update({ where: { id }, data })
  }
}
