import { Vendor } from 'src/domain/entities/vendor.entity';
import { CreateVendorCompanyDto } from 'src/application/dto/vendor/create-vendor-company.dto';
import { VendorStatus } from 'src/domain/enums/vendor-status.enum';
import {
  VendorPersistence,
  VendorCreatePersistenceInput,
  VendorUpdatePersistenceInput,
  VendorWherePersistenceInput,
} from 'src/infrastructure/types/vendor.types';
import { VendorResponseDto } from 'src/application/dto/vendor/vendor-response.dto';

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

  /**
   * Converts a Prisma result to domain entity.
   * Encapsulates the type conversion internally.
   */
  static fromPrismaResult<T extends Record<string, unknown>>(
    result: T,
  ): Vendor {
    return this.persistenceToEntity(result as unknown as VendorPersistence);
  }

  /**
   * Converts a Prisma result array to domain entities.
   */
  static fromPrismaResults<T extends Record<string, unknown>>(
    results: T[],
  ): Vendor[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  /**
   * Converts create input to Prisma-compatible format.
   * The return type is intentionally widened for Prisma compatibility.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toPrismaCreateInput(data: Partial<Vendor>): any {
    return this.createToPersistence(data);
  }

  /**
   * Converts update input to Prisma-compatible format.
   * The return type is intentionally widened for Prisma compatibility.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toPrismaUpdateInput(data: Partial<Vendor>): any {
    return this.updateToPersistence(data);
  }

  /**
   * Converts where input to Prisma-compatible format.
   * The return type is intentionally widened for Prisma compatibility.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toPrismaWhereInput(where: VendorWherePersistenceInput): any {
    return where;
  }

  static persistenceToEntity(persistence: VendorPersistence): Vendor {
    return new Vendor({
      id: persistence.id,
      userId: persistence.user_id,
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
      vendorStatus: persistence.vendor_status as unknown as VendorStatus,
      rejectionReason: persistence.rejection_reason ?? undefined,
      user: persistence.user
        ? {
            id: persistence.user.id,
            firstName: persistence.user.first_name,
            lastName: persistence.user.last_name,
            email: persistence.user.email,
          }
        : undefined,
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

  static domainToResponse(vendor: Vendor): VendorResponseDto {
    return {
      id: vendor.id,
      userId: vendor.userId,
      companyName: vendor.companyName,
      registrationNumber: vendor.registrationNumber,
      taxNumber: vendor.taxNumber ?? '',
      yearsInBusiness: vendor.yearsInBusiness ?? 0,
      addressStreet: vendor.addressStreet ?? '',
      addressCity: vendor.addressCity ?? '',
      addressState: vendor.addressState ?? '',
      addressZipCode: vendor.addressZipCode ?? '',
      productsServices: vendor.productsService,
      websiteUrl: vendor.websiteUrl ?? '',
      contactEmail: vendor.contactEmail ?? '',
      contactPhone: vendor.contactPhone ?? '',
      vendorStatus: vendor.vendorStatus,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      user: vendor.user
        ? {
            firstName: vendor.user.firstName,
            lastName: vendor.user.lastName,
            email: vendor.user.email,
          }
        : null,
    };
  }

  static createToPersistence(
    data: Partial<Vendor>,
  ): VendorCreatePersistenceInput {
    return {
      user_id: data.userId!,
      company_name: data.companyName!,
      registration_number: data.registrationNumber!,
      tax_number: data.taxNumber ?? null,
      years_in_business: data.yearsInBusiness ?? null,
      address_street: data.addressStreet ?? null,
      address_city: data.addressCity ?? null,
      address_state: data.addressState ?? null,
      address_zip_code: data.addressZipCode ?? null,
      products_services: data.productsService ?? [],
      website_url: data.websiteUrl ?? null,
      contact_email: data.contactEmail ?? null,
      contact_phone: data.contactPhone ?? null,
      vendor_status: data.vendorStatus!,
      rejection_reason: data.rejectionReason ?? null,
      is_deleted: false,
    };
  }

  static updateToPersistence(
    data: Partial<Vendor>,
  ): VendorUpdatePersistenceInput {
    const updateData: VendorUpdatePersistenceInput = {};

    if (data.companyName !== undefined)
      updateData.company_name = data.companyName;
    if (data.registrationNumber !== undefined)
      updateData.registration_number = data.registrationNumber;
    if (data.taxNumber !== undefined)
      updateData.tax_number = data.taxNumber ?? null;
    if (data.yearsInBusiness !== undefined)
      updateData.years_in_business = data.yearsInBusiness ?? null;
    if (data.addressStreet !== undefined)
      updateData.address_street = data.addressStreet ?? null;
    if (data.addressCity !== undefined)
      updateData.address_city = data.addressCity ?? null;
    if (data.addressState !== undefined)
      updateData.address_state = data.addressState ?? null;
    if (data.addressZipCode !== undefined)
      updateData.address_zip_code = data.addressZipCode ?? null;
    if (data.productsService !== undefined)
      updateData.products_services = data.productsService;
    if (data.websiteUrl !== undefined)
      updateData.website_url = data.websiteUrl ?? null;
    if (data.contactEmail !== undefined)
      updateData.contact_email = data.contactEmail ?? null;
    if (data.contactPhone !== undefined)
      updateData.contact_phone = data.contactPhone ?? null;
    if (data.vendorStatus !== undefined)
      updateData.vendor_status = data.vendorStatus;
    if (data.rejectionReason !== undefined)
      updateData.rejection_reason = data.rejectionReason ?? null;

    return updateData;
  }
}
