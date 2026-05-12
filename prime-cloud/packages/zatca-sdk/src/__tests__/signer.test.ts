import { Signer } from '../signer'

describe('Signer', () => {
  let signer: Signer
  const testXml = '<?xml version="1.0"?><Invoice><cbc:IssueTime>14:30:00</cbc:IssueTime></Invoice>'
  const testCert = 'CN=Test Organization, O=Test, C=SA'

  beforeEach(() => {
    signer = new Signer()
  })

  it('adds digital signature to XML', () => {
    const result = signer.sign(testXml, 'fake-private-key', testCert)
    expect(result.signedXml).toContain('cbc:DigitalSignature')
    expect(result.signedXml).toContain('cac:Signature')
  })

  it('returns a signed XML string', () => {
    const result = signer.sign(testXml, 'fake-private-key', testCert)
    expect(typeof result.signedXml).toBe('string')
    expect(result.signedXml.length).toBeGreaterThan(testXml.length)
  })

  it('includes signing time', () => {
    const result = signer.sign(testXml, 'fake-private-key', testCert)
    expect(result.signingTime).toBeDefined()
    expect(() => new Date(result.signingTime)).not.toThrow()
  })
})
