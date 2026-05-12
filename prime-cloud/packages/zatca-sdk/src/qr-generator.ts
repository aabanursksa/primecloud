export class QRGenerator {
  generateTLV(
    sellerName: string,
    taxNumber: string,
    invoiceDate: string,
    totalAmount: number,
    taxTotal: number,
  ): string {
    const tags: { tag: number; value: string }[] = [
      { tag: 1, value: sellerName },
      { tag: 2, value: taxNumber },
      { tag: 3, value: invoiceDate },
      { tag: 4, value: this.formatAmount(totalAmount) },
      { tag: 5, value: this.formatAmount(taxTotal) },
    ];

    let tlvBuffer = Buffer.alloc(0);

    for (const { tag, value } of tags) {
      const valueBuffer = Buffer.from(value, 'utf-8');
      const tagBuffer = Buffer.from([tag]);
      const lengthBuffer = this.encodeLength(valueBuffer.length);

      tlvBuffer = Buffer.concat([tlvBuffer, tagBuffer, lengthBuffer, valueBuffer]);
    }

    return tlvBuffer.toString('base64');
  }

  private encodeLength(length: number): Buffer {
    if (length < 128) {
      return Buffer.from([length]);
    }

    const bytes: number[] = [];
    let temp = length;
    while (temp > 0) {
      bytes.unshift(temp & 0xff);
      temp >>= 8;
    }

    return Buffer.from([0x80 | bytes.length, ...bytes]);
  }

  private formatAmount(halalas: number): string {
    return (halalas / 100).toFixed(2);
  }
}
