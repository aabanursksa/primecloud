import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ProductsService } from './products.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Body() body: { name: string; nameAr: string; price: number; barcode?: string; cost?: number; categoryId?: string }) {
    return this.productsService.create(body)
  }

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.productsService.findAll(Number(limit) || 500, Number(offset) || 0)
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.productsService.search(q || '')
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body)
  }
}
