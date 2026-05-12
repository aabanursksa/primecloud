import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { TenantsService } from './tenants.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  async create(@Body() body: { name: string; slug: string; plan?: string }) {
    return this.tenantsService.create(body)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async findAll() {
    return this.tenantsService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.tenantsService.findById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async update(@Param('id') id: string, @Body() body: { name?: string; plan?: string; isActive?: boolean }) {
    return this.tenantsService.update(id, body)
  }
}
