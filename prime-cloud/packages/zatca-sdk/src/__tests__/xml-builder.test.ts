import { XMLBuilder } from '../xml-builder'
import type { ZATCAInvoiceInput } from '../xml-builder'

describe('XMLBuilder', () => {
  let builder: XMLBuilder

  const sampleInput: ZATCAInvoiceInput = {
    uuid: 'test-uuid-123',
    invoiceCounter: 1,
    previousInvoiceHash: '0000000000000000000000000000000000000000000000000000000000000000',
    issueDate: '2026-05-12',
    issueTime: '14:30:00',
    invoiceType: 'SIMPLIFIED',
    currency: 'SAR',
    lineItems: [
      { name: 'Test Product', quantity: 2, unitPrice: 5000, taxAmount: 750, totalAmount: 5750 },
    ],
    taxTotal: 750,
    totalAmount: 5750,
    sellerInfo: { name: 'Prime Cloud', taxNumber: '310123456700003' },
  }

  beforeEach(() => {
    builder = new XMLBuilder()
  })

  it('generates valid XML with UBL 2.1 declaration', () => {
    const xml = builder.build(sampleInput)
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"')
    expect(xml).toContain('cbc:UBLVersionID>2.1')
  })

  it('includes invoice type code for SIMPLIFIED', () => {
    const xml = builder.build(sampleInput)
    expect(xml).toContain('InvoiceTypeCode name="SIMPLIFIED"')
    expect(xml).toContain('>388<')
  })

  it('includes invoice type code for STANDARD', () => {
    const xml = builder.build({ ...sampleInput, invoiceType: 'STANDARD' })
    expect(xml).toContain('InvoiceTypeCode name="STANDARD"')
    expect(xml).toContain('>383<')
  })

  it('includes line items', () => {
    const xml = builder.build(sampleInput)
    expect(xml).toContain('Test Product')
    expect(xml).toContain('InvoicedQuantity')
    expect(xml).toContain('LineExtensionAmount')
  })

  it('includes seller info', () => {
    const xml = builder.build(sampleInput)
    expect(xml).toContain('Prime Cloud')
    expect(xml).toContain('310123456700003')
  })

  it('includes buyer info when provided', () => {
    const xml = builder.build({
      ...sampleInput,
      buyerInfo: { name: 'Buyer Co', taxNumber: '310987654300001' },
    })
    expect(xml).toContain('Buyer Co')
    expect(xml).toContain('310987654300001')
  })

  it('omits buyer section when not provided', () => {
    const xml = builder.build(sampleInput)
    expect(xml).not.toContain('AccountingCustomerParty')
  })

  it('escapes XML special characters', () => {
    const xml = builder.build({
      ...sampleInput,
      lineItems: [{ ...sampleInput.lineItems[0], name: 'Product & "Service" <Test>' }],
    })
    expect(xml).toContain('&amp;')
    expect(xml).toContain('&quot;')
    expect(xml).toContain('&lt;')
  })

  it('includes monetary totals', () => {
    const xml = builder.build(sampleInput)
    expect(xml).toContain('cbc:TaxExclusiveAmount')
    expect(xml).toContain('cbc:TaxInclusiveAmount')
    expect(xml).toContain('cbc:PayableAmount')
    expect(xml).toContain('5.75') // 5750 / 100 / 10 / 10
  })
})
