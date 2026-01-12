import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateVendorCommand } from '../../../commands/vendor/update-vendor.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { VendorMapper } from '../../../mappers/vendor/vendor.mapper';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';

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
    if (data.companyName) vendor.companyName = data.companyName;
    if (data.contactEmail) vendor.contactEmail = data.contactEmail;
    if (data.contactPhone) vendor.contactPhone = data.contactPhone;
    if (data.addressCity) vendor.addressCity = data.addressCity;
    // Add other fields as needed based on data object
    if (data.registrationNumber)
      vendor.registrationNumber = data.registrationNumber;
    if (data.taxNumber) vendor.taxNumber = data.taxNumber;
    if (data.addressStreet) vendor.addressStreet = data.addressStreet;
    if (data.addressState) vendor.addressState = data.addressState;
    if (data.addressZipCode) vendor.addressZipCode = data.addressZipCode;
    if (data.websiteUrl) vendor.websiteUrl = data.websiteUrl;
    if (data.yearsInBusiness !== undefined)
      vendor.yearsInBusiness = data.yearsInBusiness;
    if (data.productsServices) vendor.productsService = data.productsServices;
    if (data.vendorStatus)
      vendor.vendorStatus = data.vendorStatus as VendorStatus;

    const updatedVendor = await this.vendorRepository.update(vendorId, vendor);

    return VendorMapper.toResponse(updatedVendor);
  }
}
