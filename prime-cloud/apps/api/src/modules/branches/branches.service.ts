import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; nameAr: string; address?: string }) {
    return this.prisma.branch.create({ data })
  }

  async findAll() {
    return this.prisma.branch.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
  }

  async findById(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } })
    if (!branch) throw new NotFoundException('Branch not found')
    return branch
  }
}
