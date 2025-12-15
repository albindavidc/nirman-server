import { CreateVendorCompanyDto } from '../dto/create-vendor-company.dto';

export class CreateVendorCompanyCommand {
  constructor(
    public readonly dto: CreateVendorCompanyDto,
    public readonly userId: string,
  ) {}
}
