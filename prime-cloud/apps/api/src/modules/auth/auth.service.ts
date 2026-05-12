import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!user.isActive) throw new UnauthorizedException('Account is disabled')

    return this.generateTokens(user)
  }

  async register(data: { email: string; password: string; name: string; tenantId: string; role?: string; branchId?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new ConflictException('Email already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        tenantId: data.tenantId,
        role: data.role || 'cashier',
        branchId: data.branchId,
      },
    })

    return this.generateTokens(user)
  }

  private generateTokens(user: { id: string; tenantId: string; role: string; branchId?: string | null }) {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role, branchId: user.branchId }
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }
}
