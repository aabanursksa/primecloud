import { createHash, createSign } from 'node:crypto';

export interface SigningResult {
  signedXml: string;
  digitalSignature: string;
  signingTime: string;
}

export class Signer {
  sign(xml: string, privateKeyPem: string, certificatePem: string): SigningResult {
    const signingTime = new Date().toISOString();

    const hash = createHash('sha256').update(xml, 'utf-8').digest('base64');

    const signer = createSign('SHA256');
    signer.update(xml, 'utf-8');
    const signatureBase64 = signer.sign(privateKeyPem, 'base64');

    const signedXml = xml.replace(
      '</cbc:IssueTime>',
      `</cbc:IssueTime>
  <cbc:DigitalSignature>${signatureBase64}</cbc:DigitalSignature>
  <cac:Signature>
    <cbc:ID>urn:oasis:names:specification:ubl:signature:Invoice</cbc:ID>
    <cbc:SignatureMethod>urn:oasis:names:specification:ubl:dsig:enveloped:xades</cbc:SignatureMethod>
    <cac:SignatoryParty>
      <cac:PartyIdentification>
        <cbc:ID>${this.extractCN(certificatePem)}</cbc:ID>
      </cac:PartyIdentification>
    </cac:SignatoryParty>
    <cac:DigitalSignatureAttachment>
      <cac:ExternalReference>
        <cbc:URI>#signature</cbc:URI>
      </cac:ExternalReference>
    </cac:DigitalSignatureAttachment>
  </cac:Signature>`,
    );

    return {
      signedXml,
      digitalSignature: signatureBase64,
      signingTime,
    };
  }

  private extractCN(certPem: string): string {
    const match = certPem.match(/CN\s*=\s*([^,\n]+)/);
    return match ? match[1].trim() : 'Unknown';
  }
}
