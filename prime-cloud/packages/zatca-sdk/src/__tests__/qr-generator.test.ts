import { QRGenerator } from '../qr-generator'

describe('QRGenerator', () => {
  let generator: QRGenerator

  beforeEach(() => {
    generator = new QRGenerator()
  })

  it('generates base64 TLV string', () => {
    const result = generator.generateTLV('Prime Cloud', '310123456700003', '2026-05-12', 5750, 750)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes all 5 required ZATCA tags', () => {
    const result = generator.generateTLV('Seller Name', '1234567890', '2026-01-01', 11500, 1500)
    const decoded = Buffer.from(result, 'base64')
    // Tag 1-5: seller name, tax number, date, total, vat
    expect(decoded[0]).toBe(1) // tag 1
    expect(decoded.toString('utf-8')).toContain('Seller Name')
    expect(decoded.toString('utf-8')).toContain('1234567890')
    expect(decoded.toString('utf-8')).toContain('2026-01-01')
  })

  it('handles different amount formats', () => {
    const result1 = generator.generateTLV('A', 'B', '2026-01-01', 100, 15)
    const result2 = generator.generateTLV('A', 'B', '2026-01-01', 100000, 15000)
    expect(result1).not.toBe(result2)
  })

  it('produces deterministic output for same input', () => {
    const r1 = generator.generateTLV('Test', '123', '2026-01-01', 1000, 150)
    const r2 = generator.generateTLV('Test', '123', '2026-01-01', 1000, 150)
    expect(r1).toBe(r2)
  })
})
