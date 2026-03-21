import { Query } from '@nestjs/cqrs';
import { VendorStatus } from '../../../domain/enums/vendor-status.enum';

export class GetVendorsQuery extends Query<{
  data: any[];
  total: number;
  page: number;
  limit: number;
}> {
  constructor(
    public readonly status?: VendorStatus,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {
    super();
  }
}
