import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../modules/auth/auth.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { ConflictException, UnauthorizedException } from '@nestjs/common'

describe('AuthService', () => {
  let authService: AuthService
  let prisma: any
  let jwtService: JwtService

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: '$2a$10$hashedpassword',
    name: 'Test User',
    role: 'cashier',
    tenantId: 'tenant-1',
    branchId: null,
    isActive: true,
  }

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    }

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  describe('login', () => {
    it('throws UnauthorizedException for invalid email', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      await expect(authService.login('wrong@email.com', 'pass')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('throws UnauthorizedException for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      await expect(authService.login('test@example.com', 'wrongpass')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('throws UnauthorizedException for inactive user', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false })
      await expect(authService.login('test@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('register', () => {
    it('throws ConflictException for duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'pass',
          name: 'Test',
          tenantId: 'tenant-1',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })
})
