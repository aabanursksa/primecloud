import { ChainHash } from '../chain-hash'

describe('ChainHash', () => {
  it('uses zero hash for first invoice', () => {
    const chain = new ChainHash()
    const result = chain.add('<invoice>test</invoice>')
    expect(result.previousHash).toBe('0000000000000000000000000000000000000000000000000000000000000000')
  })

  it('generates SHA-256 hash in uppercase hex', () => {
    const chain = new ChainHash()
    const result = chain.add('<invoice>data</invoice>')
    expect(result.hash).toMatch(/^[A-F0-9]{64}$/)
  })

  it('chains invoices correctly', () => {
    const chain = new ChainHash()
    const first = chain.add('<invoice>first</invoice>')
    const second = chain.add('<invoice>second</invoice>')
    expect(second.previousHash).toBe(first.hash)
  })

  it('returns previous hash via getter', () => {
    const chain = new ChainHash('PREV_HASH_VALUE')
    expect(chain.getPreviousHash()).toBe('PREV_HASH_VALUE')
  })

  it('supports custom initial hash', () => {
    const customHash = 'A'.repeat(64)
    const chain = new ChainHash(customHash)
    const result = chain.add('<invoice>test</invoice>')
    expect(result.previousHash).toBe(customHash)
  })

  it('can be reset', () => {
    const chain = new ChainHash()
    chain.add('<invoice>first</invoice>')
    chain.reset()
    expect(chain.getPreviousHash()).toBeNull()
    const result = chain.add('<invoice>after-reset</invoice>')
    expect(result.previousHash).toBe('0000000000000000000000000000000000000000000000000000000000000000')
  })

  it('computeHash returns consistent results', () => {
    const chain = new ChainHash()
    const h1 = chain.computeHash('<invoice>A</invoice>')
    const h2 = chain.computeHash('<invoice>A</invoice>')
    expect(h1).toBe(h2)
  })
})
