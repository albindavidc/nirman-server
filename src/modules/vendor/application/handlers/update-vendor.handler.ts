import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateVendorCommand } from '../commands/update-vendor.command';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const updateData: any = {};

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
    if (data.vendorStatus) updateData.vendor_status = data.vendorStatus;

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

    return this.mapToDto(updated);
  }

  private mapToDto(vendor: any) {
    return {
      id: vendor.id,
      userId: vendor.user_id,
      companyName: vendor.company_name,
      registrationNumber: vendor.registration_number,
      taxNumber: vendor.tax_number,
      yearsInBusiness: vendor.years_in_business,
      addressStreet: vendor.address_street,
      addressCity: vendor.address_city,
      addressState: vendor.address_state,
      addressZipCode: vendor.address_zip_code,
      productsServices: vendor.products_services,
      websiteUrl: vendor.website_url,
      contactEmail: vendor.contact_email,
      contactPhone: vendor.contact_phone,
      vendorStatus: vendor.vendor_status,
      createdAt: vendor.created_at,
      updatedAt: vendor.updated_at,
      user: vendor.user
        ? {
            firstName: vendor.user.first_name,
            lastName: vendor.user.last_name,
            email: vendor.user.email,
          }
        : null,
    };
  }
}
