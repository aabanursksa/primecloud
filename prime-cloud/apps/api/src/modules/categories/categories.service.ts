import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; nameAr: string }) {
    return this.prisma.category.create({ data })
  }

  async findAll() {
    return this.prisma.category.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
  }

  async findById(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } })
    if (!cat) throw new NotFoundException('Category not found')
    return cat
  }
}
