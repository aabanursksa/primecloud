import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() body: { name: string; nameAr: string }) {
    return this.categoriesService.create(body)
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id)
  }
}
