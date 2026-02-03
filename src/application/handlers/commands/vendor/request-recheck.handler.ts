import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestRecheckCommand } from '../../../commands/vendor/request-recheck.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../../infrastructure/persistence/repositories/vendor/vendor.mapper';

@CommandHandler(RequestRecheckCommand)
export class RequestRecheckHandler implements ICommandHandler<RequestRecheckCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: RequestRecheckCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.vendorRepository.update(id, {
      vendorStatus: VendorStatus.PENDING,
      rejectionReason: null,
    });

    return VendorMapper.domainToResponse(updatedVendor);
  }
}
