import { Command } from '@nestjs/cqrs';
import { CreateVendorCompanyDto } from '../../dto/vendor/create-vendor-company.dto';

export class CreateVendorCompanyCommand extends Command<string> {
  constructor(
    public readonly dto: CreateVendorCompanyDto,
    public readonly userId: string,
  ) {
    super();
  }
}
