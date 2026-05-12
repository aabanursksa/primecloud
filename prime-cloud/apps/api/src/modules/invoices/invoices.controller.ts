import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() body: {
    type: string
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[]
    subtotal: number
    vat: number
    total: number
    note?: string
    status?: string
  }) {
    return this.invoicesService.create(body)
  }

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.invoicesService.findAll(Number(limit) || 50, Number(offset) || 0)
  }

  @Get('stats')
  async getStats() {
    return this.invoicesService.getStats()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.invoicesService.findById(id)
  }
}
