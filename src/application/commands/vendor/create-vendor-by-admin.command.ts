import { Command } from '@nestjs/cqrs';
import { CreateVendorByAdminDto } from '../../dto/vendor/create-vendor-by-admin.dto';
import { VendorResponseDto } from '../../dto/vendor/vendor-response.dto';

export class CreateVendorByAdminCommand extends Command<VendorResponseDto> {
  constructor(public readonly dto: CreateVendorByAdminDto) {
    super();
  }
}
