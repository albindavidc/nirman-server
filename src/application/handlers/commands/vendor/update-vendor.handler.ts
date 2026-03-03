import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { UpdateVendorCommand } from '../../../commands/vendor/update-vendor.command';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../mappers/vendor.mapper';

@CommandHandler(UpdateVendorCommand)
export class UpdateVendorHandler implements ICommandHandler<UpdateVendorCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: UpdateVendorCommand): Promise<VendorResponseDto> {
    const { vendorId, data } = command;

    const vendor = await this.vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Map modifications
    if (
      data.companyName !== undefined ||
      data.registrationNumber !== undefined ||
      data.taxNumber !== undefined ||
      data.yearsInBusiness !== undefined ||
      data.websiteUrl !== undefined
    ) {
      vendor.updateCompanyDetails(
        data.companyName ?? vendor.companyName,
        data.registrationNumber ?? vendor.registrationNumber,
        data.taxNumber ?? vendor.taxNumber,
        data.yearsInBusiness ?? vendor.yearsInBusiness,
        data.websiteUrl ?? vendor.websiteUrl,
      );
    }

    if (
      data.addressCity !== undefined ||
      data.addressStreet !== undefined ||
      data.addressState !== undefined ||
      data.addressZipCode !== undefined
    ) {
      vendor.updateAddress(
        data.addressStreet ?? vendor.addressStreet,
        data.addressCity ?? vendor.addressCity,
        data.addressState ?? vendor.addressState,
        data.addressZipCode ?? vendor.addressZipCode,
      );
    }

    if (data.contactEmail !== undefined || data.contactPhone !== undefined) {
      vendor.updateContactInfo(
        data.contactEmail ?? vendor.contactEmail,
        data.contactPhone ?? vendor.contactPhone,
      );
    }

    if (data.productsServices !== undefined) {
      vendor.setProductsOrServices(data.productsServices);
    }

    if (data.vendorStatus !== undefined) {
      vendor.updateStatus(data.vendorStatus as VendorStatus);
    }

    const updatedVendor = await this.vendorRepository.update(vendorId, vendor);

    return VendorMapper.toResponse(updatedVendor);
  }
}
