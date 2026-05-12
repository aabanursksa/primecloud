import { createHash } from 'node:crypto';

export class ChainHash {
  private previousHash: string | null = null;

  constructor(previousHash?: string) {
    this.previousHash = previousHash || null;
  }

  getPreviousHash(): string | null {
    return this.previousHash;
  }

  computeHash(invoiceXml: string): string {
    const hash = createHash('sha256').update(invoiceXml, 'utf-8').digest('hex').toUpperCase();
    return hash;
  }

  add(invoiceXml: string): { hash: string; previousHash: string } {
    const currentPreviousHash = this.previousHash || '0000000000000000000000000000000000000000000000000000000000000000';
    const hash = this.computeHash(invoiceXml);
    this.previousHash = hash;

    return {
      hash,
      previousHash: currentPreviousHash,
    };
  }

  reset() {
    this.previousHash = null;
  }
}
