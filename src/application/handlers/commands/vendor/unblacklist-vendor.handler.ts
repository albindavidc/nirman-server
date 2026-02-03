import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblacklistVendorCommand } from '../../../commands/vendor/unblacklist-vendor.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../../infrastructure/persistence/repositories/vendor/vendor.mapper';

@CommandHandler(UnblacklistVendorCommand)
export class UnblacklistVendorHandler implements ICommandHandler<UnblacklistVendorCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: UnblacklistVendorCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.vendorRepository.update(id, {
      vendorStatus: VendorStatus.APPROVED,
    });

    return VendorMapper.domainToResponse(updatedVendor);
  }
}
