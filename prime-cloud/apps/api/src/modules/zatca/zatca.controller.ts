import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ZatcaService } from './zatca.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('zatca')
@UseGuards(JwtAuthGuard)
export class ZatcaController {
  constructor(private zatcaService: ZatcaService) {}

  @Post('submit/:invoiceId')
  async submit(@Param('invoiceId') invoiceId: string) {
    return this.zatcaService.submit(invoiceId)
  }

  @Get('status/:invoiceId')
  async getStatus(@Param('invoiceId') invoiceId: string) {
    return this.zatcaService.getStatus(invoiceId)
  }

  @Get('submissions')
  async getSubmissions(@Query('limit') limit?: string) {
    return this.zatcaService.getSubmissions(Number(limit) || 50)
  }
}
