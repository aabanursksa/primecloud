import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from '../modules/products/products.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('ProductsService', () => {
  let productsService: ProductsService
  let prisma: any

  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    nameAr: 'منتج اختبار',
    price: 5000,
    barcode: '123456789',
    cost: 3000,
    categoryId: 'cat-1',
    isActive: true,
    tenantId: 'tenant-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile()

    productsService = module.get<ProductsService>(ProductsService)
  })

  describe('findAll', () => {
    it('returns active products with categories', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct])
      const result = await productsService.findAll()
      expect(result).toHaveLength(1)
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { category: true },
        take: 500,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      })
    })

    it('respects limit and offset', async () => {
      prisma.product.findMany.mockResolvedValue([])
      await productsService.findAll(10, 5)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10, skip: 5 }),
      )
    })
  })

  describe('findById', () => {
    it('returns product when found', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct)
      const result = await productsService.findById('prod-1')
      expect(result.id).toBe('prod-1')
    })

    it('throws NotFoundException when not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null)
      await expect(productsService.findById('nonexistent')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('creates and returns a product', async () => {
      prisma.product.create.mockResolvedValue(mockProduct)
      const result = await productsService.create({
        name: 'Test Product',
        nameAr: 'منتج اختبار',
        price: 5000,
        categoryId: 'cat-1',
      })
      expect(result).toBeDefined()
      expect(prisma.product.create).toHaveBeenCalled()
    })
  })

  describe('search', () => {
    it('searches by name, nameAr, and barcode', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct])
      const result = await productsService.search('Test')
      expect(result).toHaveLength(1)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.any(Object) }),
              expect.objectContaining({ nameAr: expect.any(Object) }),
              expect.objectContaining({ barcode: expect.any(Object) }),
            ]),
          }),
        }),
      )
    })
  })
})
