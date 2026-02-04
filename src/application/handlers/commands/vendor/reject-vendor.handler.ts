import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RejectVendorCommand } from '../../../commands/vendor/reject-vendor.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../../infrastructure/mappers/vendor.mapper';

@CommandHandler(RejectVendorCommand)
export class RejectVendorHandler implements ICommandHandler<RejectVendorCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: RejectVendorCommand): Promise<VendorResponseDto> {
    const { id, reason } = command;

    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.vendorRepository.update(id, {
      vendorStatus: VendorStatus.REJECTED,
      rejectionReason: reason,
    });

    return VendorMapper.domainToResponse(updatedVendor);
  }
}
