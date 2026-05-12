import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { DEFAULT_CHART_OF_ACCOUNTS } from '@prime-cloud/accounting-engine'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Prime Cloud...')

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'prime-demo' },
    update: {},
    create: {
      name: 'Prime Demo',
      slug: 'prime-demo',
      plan: 'enterprise',
    },
  })

  // Create tenant schema
  const schemaName = `tenant_${tenant.id.replace(/-/g, '_')}`
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)

  // Create admin user
  const password = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@primecloud.sa' },
    update: {},
    create: {
      email: 'admin@primecloud.sa',
      password,
      name: 'مدير النظام',
      role: 'owner',
      tenantId: tenant.id,
      branchId: null,
    },
  })

  // Create default branch
  const branch = await prisma.branch.create({
    data: {
      tenantId: tenant.id,
      name: 'Main Branch',
      nameAr: 'الفرع الرئيسي',
      address: 'Riyadh, Saudi Arabia',
    },
  })

  // Create default chart of accounts
  for (const [code, info] of Object.entries(DEFAULT_CHART_OF_ACCOUNTS)) {
    await prisma.account.create({
      data: {
        tenantId: tenant.id,
        code,
        nameAr: info.nameAr,
        nameEn: info.nameEn,
        type: info.type,
        level: code.length === 4 ? 1 : 2,
      },
    })
  }

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Food', nameAr: 'طعام' } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Beverages', nameAr: 'مشروبات' } }),
    prisma.category.create({ data: { tenantId: tenant.id, name: 'Snacks', nameAr: 'وجبات خفيفة' } }),
  ])

  // Create sample products
  const sampleProducts = [
    { name: 'Grilled Chicken Plate', nameAr: 'وجبة دجاج مشوي', price: 4500, categoryId: categories[0].id },
    { name: 'Beef Burger', nameAr: 'برجر لحم', price: 3500, categoryId: categories[0].id },
    { name: 'Caesar Salad', nameAr: 'سلطة سيزر', price: 2800, categoryId: categories[0].id },
    { name: 'Pepsi Can', nameAr: 'علبة بيبسي', price: 500, categoryId: categories[1].id },
    { name: 'Water Bottle', nameAr: 'ماء معدني', price: 300, categoryId: categories[1].id },
    { name: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', price: 1500, categoryId: categories[1].id },
    { name: 'French Fries', nameAr: 'بطاطس مقلية', price: 1200, categoryId: categories[2].id },
    { name: 'Chicken Wings', nameAr: 'أجنحة دجاج', price: 2200, categoryId: categories[2].id },
    { name: 'Mozzarella Sticks', nameAr: 'أصابع موزاريلا', price: 1800, categoryId: categories[2].id },
  ]

  for (const product of sampleProducts) {
    await prisma.product.create({
      data: { ...product, tenantId: tenant.id },
    })
  }

  console.log('Seed complete!')
  console.log('  Admin email: admin@primecloud.sa')
  console.log('  Admin password: admin123')
  console.log(`  Tenant: ${tenant.name} (${tenant.id})`)
  console.log(`  Branch: ${branch.nameAr} (${branch.id})`)
  console.log(`  Accounts: ${Object.keys(DEFAULT_CHART_OF_ACCOUNTS).length}`)
  console.log(`  Products: ${sampleProducts.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
