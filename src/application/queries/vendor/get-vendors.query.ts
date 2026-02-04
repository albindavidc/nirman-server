import { VendorStatus } from '../../../domain/enums/vendor-status.enum';

export class GetVendorsQuery {
  constructor(
    public readonly status?: VendorStatus,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
