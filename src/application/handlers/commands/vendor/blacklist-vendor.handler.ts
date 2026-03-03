import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../mappers/vendor.mapper';
import { BlacklistVendorCommand } from '../../../commands/vendor/blacklist-vendor.command';

@CommandHandler(BlacklistVendorCommand)
export class BlacklistVendorHandler implements ICommandHandler<BlacklistVendorCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: BlacklistVendorCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.vendorRepository.update(id, {
      vendorStatus: VendorStatus.BLACKLISTED,
    });

    return VendorMapper.toResponse(updatedVendor);
  }
}
