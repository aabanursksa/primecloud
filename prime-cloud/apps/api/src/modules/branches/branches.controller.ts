import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { BranchesService } from './branches.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Post()
  async create(@Body() body: { name: string; nameAr: string; address?: string }) {
    return this.branchesService.create(body)
  }

  @Get()
  async findAll() {
    return this.branchesService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.branchesService.findById(id)
  }
}
