export interface ZATCAConfig {
  apiUrl: string;
  csid: string;
  privateKey: string;
  certificate: string;
  otp?: string;
}

export interface SubmitResult {
  status: 'accepted' | 'rejected' | 'pending';
  uuid: string;
  errors?: ZATCAError[];
  warnings?: string[];
}

export interface ZATCAError {
  code: string;
  message: string;
  category?: string;
}

export class ZATCAApi {
  private config: ZATCAConfig;

  constructor(config: ZATCAConfig) {
    this.config = config;
  }

  async submitInvoice(xml: string, invoiceType: 'SIMPLIFIED' | 'STANDARD'): Promise<SubmitResult> {
    const isClearance = invoiceType === 'STANDARD';
    const endpoint = isClearance ? '/invoices/clearance/single' : '/invoices/reporting/single';

    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.config.csid}`,
          'Clearance-Status': isClearance ? '1' : '0',
        },
        body: xml,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          status: 'rejected',
          uuid: '',
          errors: [{ code: `HTTP_${response.status}`, message: errorBody }],
        };
      }

      const result = await response.json();

      return {
        status: result.clearanceStatus === 'CLEARED' || result.status === 'ACCEPTED' ? 'accepted' : 'pending',
        uuid: result.invoiceUUID || result.uuid || '',
        errors: result.errors?.map((e: any) => ({
          code: e.code || 'UNKNOWN',
          message: e.message || e.detail || 'Unknown error',
          category: e.category,
        })),
        warnings: result.warnings,
      };
    } catch (err: any) {
      return {
        status: 'rejected',
        uuid: '',
        errors: [{ code: 'NETWORK_ERROR', message: err.message || 'Failed to connect to ZATCA' }],
      };
    }
  }

  async checkInvoiceStatus(uuid: string): Promise<{ status: string; reportedAt?: string }> {
    try {
      const response = await fetch(`${this.config.apiUrl}/invoices/${uuid}/status`, {
        headers: {
          'Authorization': `Bearer ${this.config.csid}`,
        },
      });

      if (!response.ok) return { status: 'unknown' };

      const result = await response.json();
      return {
        status: result.status || 'unknown',
        reportedAt: result.reportedAt,
      };
    } catch {
      return { status: 'unknown' };
    }
  }
}
