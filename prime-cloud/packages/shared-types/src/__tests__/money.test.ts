import { toHalalas, fromHalalas, formatSAR } from '../index'

describe('toHalalas', () => {
  it('converts SAR to halalas', () => {
    expect(toHalalas(100)).toBe(10000)
    expect(toHalalas(0)).toBe(0)
    expect(toHalalas(1.5)).toBe(150)
    expect(toHalalas(99.99)).toBe(9999)
  })

  it('rounds to nearest halala', () => {
    expect(toHalalas(10.001)).toBe(1000)
    expect(toHalalas(10.005)).toBe(1001)
  })

  it('handles negative values', () => {
    expect(toHalalas(-50)).toBe(-5000)
  })
})

describe('fromHalalas', () => {
  it('converts halalas to SAR string', () => {
    expect(fromHalalas(10000)).toBe('100.00')
    expect(fromHalalas(0)).toBe('0.00')
    expect(fromHalalas(150)).toBe('1.50')
    expect(fromHalalas(9999)).toBe('99.99')
  })

  it('handles zero', () => {
    expect(fromHalalas(0)).toBe('0.00')
  })
})

describe('formatSAR', () => {
  it('formats halalas as SAR currency', () => {
    expect(formatSAR(10000)).toBe('100.00 SAR')
    expect(formatSAR(0)).toBe('0.00 SAR')
    expect(formatSAR(150)).toBe('1.50 SAR')
  })
})
