import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { VendorStatus } from 'src/modules/vendor/domain/enums/vendor-status.enum';
import { UpdateVendorCommand } from '../commands/update-vendor.command';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorMapper } from '../../infrastructure/persistence/vendor.mapper';
import { VendorPersistence } from '../../infrastructure/persistence/vendor.persistence';

interface VendorUpdateData {
  company_name?: string;
  registration_number?: string;
  tax_number?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  vendor_status?: VendorStatus;
}

@CommandHandler(UpdateVendorCommand)
export class UpdateVendorHandler implements ICommandHandler<UpdateVendorCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateVendorCommand) {
    const { vendorId, data } = command;

    // Check if vendor exists
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!existingVendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    // Build update data
    const updateData: VendorUpdateData = {};

    if (data.companyName) updateData.company_name = data.companyName;
    if (data.registrationNumber)
      updateData.registration_number = data.registrationNumber;
    if (data.taxNumber !== undefined) updateData.tax_number = data.taxNumber;
    if (data.addressStreet !== undefined)
      updateData.address_street = data.addressStreet;
    if (data.addressCity !== undefined)
      updateData.address_city = data.addressCity;
    if (data.addressState !== undefined)
      updateData.address_state = data.addressState;
    if (data.addressZipCode !== undefined)
      updateData.address_zip_code = data.addressZipCode;
    if (data.contactPhone !== undefined)
      updateData.contact_phone = data.contactPhone;
    if (data.contactEmail !== undefined)
      updateData.contact_email = data.contactEmail;
    if (data.websiteUrl !== undefined) updateData.website_url = data.websiteUrl;
    if (data.vendorStatus)
      updateData.vendor_status = data.vendorStatus as VendorStatus;

    const updated = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: updateData,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    return VendorMapper.toResponse(updated as unknown as VendorPersistence);
  }
}
