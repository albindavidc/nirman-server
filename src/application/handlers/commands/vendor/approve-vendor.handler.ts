import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ApproveVendorCommand } from '../../../commands/vendor/approve-vendor.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../mappers/vendor.mapper';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import { UserStatus } from '../../../../domain/enums/user-status.enum';

@CommandHandler(ApproveVendorCommand)
export class ApproveVendorHandler implements ICommandHandler<ApproveVendorCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ApproveVendorCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updatedVendor = await this.vendorRepository.update(id, {
      vendorStatus: VendorStatus.APPROVED,
    } as any);

    const user = await this.userRepository.findById(vendor.userId);
    if (user) {
      user.updateStatus(UserStatus.ACTIVE);
      await this.userRepository.update(user.id, user);
    }

    return VendorMapper.toResponse(updatedVendor);
  }
}
