export interface ZATCAInvoiceInput {
  uuid: string;
  invoiceCounter: number;
  previousInvoiceHash: string;
  issueDate: string;
  issueTime: string;
  invoiceType: 'SIMPLIFIED' | 'STANDARD';
  currency: 'SAR';
  lineItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    totalAmount: number;
  }>;
  taxTotal: number;
  totalAmount: number;
  sellerInfo: { name: string; taxNumber: string; crNumber?: string };
  buyerInfo?: { name: string; taxNumber: string };
}

export class XMLBuilder {
  build(input: ZATCAInvoiceInput): string {
    const lines = input.lineItems.map((item, i) => `
      <cac:InvoiceLine>
        <cbc:ID>${i + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="PCE">${item.quantity}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="${input.currency}">${(item.unitPrice / 100).toFixed(2)}</cbc:LineExtensionAmount>
        <cac:TaxTotal>
          <cbc:TaxAmount currencyID="${input.currency}">${(item.taxAmount / 100).toFixed(2)}</cbc:TaxAmount>
        </cac:TaxTotal>
        <cac:Item>
          <cbc:Name>${this.escapeXml(item.name)}</cbc:Name>
        </cac:Item>
        <cac:Price>
          <cbc:PriceAmount currencyID="${input.currency}">${(item.unitPrice / 100).toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
      </cac:InvoiceLine>`).join('');

    const buyerXml = input.buyerInfo ? `
      <cac:AccountingCustomerParty>
        <cac:Party>
          <cac:PartyTaxScheme>
            <cbc:CompanyID>${this.escapeXml(input.buyerInfo.taxNumber)}</cbc:CompanyID>
          </cac:PartyTaxScheme>
          <cac:PartyLegalEntity>
            <cbc:RegistrationName>${this.escapeXml(input.buyerInfo.name)}</cbc:RegistrationName>
          </cac:PartyLegalEntity>
        </cac:Party>
      </cac:AccountingCustomerParty>` : '';

    const invoiceTypeCode = input.invoiceType === 'SIMPLIFIED' ? '388' : '383';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>${input.invoiceType === 'SIMPLIFIED' ? 'OTHR' : 'PEPPOL'}</cbc:CustomizationID>
  <cbc:ID>${this.escapeXml(input.uuid)}</cbc:ID>
  <cbc:IssueDate>${input.issueDate}</cbc:IssueDate>
  <cbc:IssueTime>${input.issueTime}</cbc:IssueTime>
  <cbc:InvoiceTypeCode name="${input.invoiceType}">${invoiceTypeCode}</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${input.currency}</cbc:DocumentCurrencyCode>
  <cac:InvoicePeriod>
    <cbc:StartDate>${input.issueDate}</cbc:StartDate>
    <cbc:EndDate>${input.issueDate}</cbc:EndDate>
  </cac:InvoicePeriod>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${this.escapeXml(input.sellerInfo.taxNumber)}</cbc:CompanyID>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${this.escapeXml(input.sellerInfo.name)}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  ${buyerXml}
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${input.currency}">${(input.taxTotal / 100).toFixed(2)}</cbc:TaxAmount>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${input.currency}">${(input.lineItems.reduce((s, l) => s + l.totalAmount, 0) / 100).toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${input.currency}">${((input.totalAmount - input.taxTotal) / 100).toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${input.currency}">${(input.totalAmount / 100).toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PrepaidAmount currencyID="${input.currency}">0.00</cbc:PrepaidAmount>
    <cbc:PayableAmount currencyID="${input.currency}">${(input.totalAmount / 100).toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  ${lines}
</Invoice>`;
  }

  private escapeXml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }
}
