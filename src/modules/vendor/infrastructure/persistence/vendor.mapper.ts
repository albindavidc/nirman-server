import { Vendor } from 'src/modules/vendor/domain/entities/vendor.entity';
import { CreateVendorCompanyDto } from 'src/modules/vendor/application/dto/create-vendor-company.dto';
import { VendorStatus } from 'src/modules/vendor/domain/enums/vendor-status.enum';
import { VendorPersistence } from 'src/modules/vendor/infrastructure/persistence/vendor.persistence';
import { VendorResponseDto } from 'src/modules/vendor/application/dto/vendor-response.dto';

export class VendorMapper {
  static dtoToEntity(dto: CreateVendorCompanyDto): Vendor {
    return new Vendor({
      userId: dto.userId,
      companyName: dto.companyName,
      registrationNumber: dto.registrationNumber,
      taxNumber: dto.taxNumber,
      yearsInBusiness: dto.yearsInBusiness,
      addressStreet: dto.addressStreet,
      addressCity: dto.addressCity,
      addressState: dto.addressState,
      addressZipCode: dto.addressZipCode,
      productsService: dto.productsServices,
      websiteUrl: dto.websiteUrl,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
      vendorStatus: dto.vendorStatus as VendorStatus,
    });
  }

  static entityToDto(entity: Vendor): CreateVendorCompanyDto {
    return {
      userId: entity.userId,
      companyName: entity.companyName,
      registrationNumber: entity.registrationNumber,
      taxNumber: entity.taxNumber ?? '',
      yearsInBusiness: entity.yearsInBusiness ?? 0,
      addressStreet: entity.addressStreet ?? '',
      addressCity: entity.addressCity ?? '',
      addressState: entity.addressState ?? '',
      addressZipCode: entity.addressZipCode ?? '',
      productsServices: entity.productsService ?? [],
      websiteUrl: entity.websiteUrl ?? '',
      contactEmail: entity.contactEmail ?? '',
      contactPhone: entity.contactPhone ?? '',
      vendorStatus: entity.vendorStatus,
    };
  }

  static entityToPersistence(
    entity: Partial<Vendor>,
  ): Partial<VendorPersistence> {
    const persistence: Partial<VendorPersistence> = {
      user_id: entity.userId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      company_name: entity.companyName,
      registration_number: entity.registrationNumber,
      tax_number: entity.taxNumber,
      years_in_business: entity.yearsInBusiness,
      address_street: entity.addressStreet,
      address_city: entity.addressCity,
      address_state: entity.addressState,
      address_zip_code: entity.addressZipCode,
      products_services: entity.productsService,
      website_url: entity.websiteUrl,
      contact_email: entity.contactEmail,
      contact_phone: entity.contactPhone,
      vendor_status: entity.vendorStatus,
      rejection_reason: entity.rejectionReason,
    };

    if (entity.id) {
      persistence.id = entity.id;
    }

    return persistence;
  }

  static persistenceToEntity(persistence: VendorPersistence): Vendor {
    return new Vendor({
      id: persistence.id,
      createdAt: persistence.created_at,
      updatedAt: persistence.updated_at,
      companyName: persistence.company_name,
      registrationNumber: persistence.registration_number,
      taxNumber: persistence.tax_number ?? undefined,
      yearsInBusiness: persistence.years_in_business ?? 0,
      addressStreet: persistence.address_street ?? '',
      addressCity: persistence.address_city ?? '',
      addressState: persistence.address_state ?? '',
      addressZipCode: persistence.address_zip_code ?? '',
      productsService: persistence.products_services ?? [],
      websiteUrl: persistence.website_url ?? '',
      contactEmail: persistence.contact_email ?? '',
      contactPhone: persistence.contact_phone ?? '',
      vendorStatus: persistence.vendor_status as VendorStatus,
      rejectionReason:
        (persistence.rejection_reason as string | null) ?? undefined,
    });
  }

  static toResponse(vendor: VendorPersistence): VendorResponseDto {
    return {
      id: vendor.id,
      userId: vendor.user_id,
      companyName: vendor.company_name,
      registrationNumber: vendor.registration_number,
      taxNumber: vendor.tax_number ?? '',
      yearsInBusiness: vendor.years_in_business ?? 0,
      addressStreet: vendor.address_street ?? '',
      addressCity: vendor.address_city ?? '',
      addressState: vendor.address_state ?? '',
      addressZipCode: vendor.address_zip_code ?? '',
      productsServices: vendor.products_services,
      websiteUrl: vendor.website_url ?? '',
      contactEmail: vendor.contact_email ?? '',
      contactPhone: vendor.contact_phone ?? '',
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
