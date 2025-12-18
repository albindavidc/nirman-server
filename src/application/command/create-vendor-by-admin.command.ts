import { CreateVendorByAdminDto } from '../dto/create-vendor-by-admin.dto';

export class CreateVendorByAdminCommand {
  constructor(public readonly dto: CreateVendorByAdminDto) {}
}
