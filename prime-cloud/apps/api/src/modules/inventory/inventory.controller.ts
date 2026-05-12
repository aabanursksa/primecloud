import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('upsert')
  async upsert(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.upsert(body.productId, body.quantity)
  }

  @Post('adjust')
  async adjust(@Body() body: { productId: string; delta: number }) {
    return this.inventoryService.adjust(body.productId, body.delta)
  }

  @Get()
  async findAll() {
    return this.inventoryService.findAll()
  }

  @Get(':productId')
  async findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId)
  }
}
