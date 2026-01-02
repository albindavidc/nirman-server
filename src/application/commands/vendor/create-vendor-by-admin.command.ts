import { CreateVendorByAdminDto } from '../../dto/vendor/create-vendor-by-admin.dto';

export class CreateVendorByAdminCommand {
  constructor(public readonly dto: CreateVendorByAdminDto) {}
}
