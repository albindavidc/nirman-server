import { Vendor } from '../../domain/entities/vendor.entity';
import { CreateVendorCompanyDto } from '../dto/vendor/create-vendor-company.dto';
import { VendorResponseDto } from '../dto/vendor/vendor-response.dto';
import { VendorStatus as DomainVendorStatus } from '../../domain/enums/vendor-status.enum';
import {
  VendorCreatePersistenceInput,
  VendorUpdatePersistenceInput,
  VendorPersistence,
  VendorWherePersistenceInput,
} from '../../infrastructure/types/vendor.types';

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
      vendorStatus: dto.vendorStatus ?? DomainVendorStatus.PENDING,
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

  static toResponse(vendor: Vendor): VendorResponseDto {
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
      productsServices: vendor.productsService ?? [],
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
   */
  static toPrismaCreateInput(
    data: Partial<Vendor>,
  ): VendorCreatePersistenceInput {
    if (!data.userId) {
      throw new Error('User ID is required for vendor creation');
    }

    const createInput: VendorCreatePersistenceInput = {
      userId: data.userId,
      companyName: data.companyName!,
      registrationNumber: data.registrationNumber!,
      taxNumber: data.taxNumber ?? null,
      yearsInBusiness: data.yearsInBusiness ?? null,
      addressStreet: data.addressStreet ?? null,
      addressCity: data.addressCity ?? null,
      addressState: data.addressState ?? null,
      addressZipCode: data.addressZipCode ?? null,
      productsServices: data.productsService ?? [],
      websiteUrl: data.websiteUrl ?? null,
      contactEmail: data.contactEmail ?? null,
      contactPhone: data.contactPhone ?? null,
      vendorStatus: data.vendorStatus ?? DomainVendorStatus.PENDING,
      rejectionReason: data.rejectionReason ?? null,
      isDeleted: false,
    };

    return createInput;
  }

  /**
   * Converts update input to Prisma-compatible format.
   */
  static toPrismaUpdateInput(
    data: Partial<Vendor>,
  ): VendorUpdatePersistenceInput {
    const updateData: VendorUpdatePersistenceInput = {};

    if (data.companyName !== undefined)
      updateData.companyName = data.companyName;
    if (data.registrationNumber !== undefined)
      updateData.registrationNumber = data.registrationNumber;
    if (data.taxNumber !== undefined) updateData.taxNumber = data.taxNumber;
    if (data.yearsInBusiness !== undefined)
      updateData.yearsInBusiness = data.yearsInBusiness;
    if (data.addressStreet !== undefined)
      updateData.addressStreet = data.addressStreet;
    if (data.addressCity !== undefined)
      updateData.addressCity = data.addressCity;
    if (data.addressState !== undefined)
      updateData.addressState = data.addressState;
    if (data.addressZipCode !== undefined)
      updateData.addressZipCode = data.addressZipCode;
    if (data.productsService !== undefined)
      updateData.productsServices = data.productsService;
    if (data.websiteUrl !== undefined) updateData.websiteUrl = data.websiteUrl;
    if (data.contactEmail !== undefined)
      updateData.contactEmail = data.contactEmail;
    if (data.contactPhone !== undefined)
      updateData.contactPhone = data.contactPhone;
    if (data.vendorStatus !== undefined)
      updateData.vendorStatus = data.vendorStatus;
    if (data.rejectionReason !== undefined)
      updateData.rejectionReason = data.rejectionReason;

    return updateData;
  }

  /**
   * Converts where input to Prisma-compatible format.
   */
  static toPrismaWhereInput(
    where: VendorWherePersistenceInput,
  ): VendorWherePersistenceInput {
    const prismaWhere: VendorWherePersistenceInput = {};

    if (where.userId) {
      if (typeof where.userId === 'object' && 'in' in where.userId) {
        prismaWhere.userId = { in: where.userId.in };
      } else {
        prismaWhere.userId = where.userId;
      }
    }
    if (where.isDeleted !== undefined)
      prismaWhere.isDeleted = where.isDeleted;
    if (where.vendorStatus) prismaWhere.vendorStatus = where.vendorStatus;

    if (where.OR) {
      prismaWhere.OR = where.OR.map((cond) => ({ ...cond }));
    }

    return prismaWhere;
  }

  static persistenceToEntity(persistence: VendorPersistence): Vendor {
    return new Vendor({
      id: persistence.id,
      userId: persistence.userId,
      companyName: persistence.companyName,
      registrationNumber: persistence.registrationNumber,
      taxNumber: persistence.taxNumber ?? undefined,
      yearsInBusiness: persistence.yearsInBusiness ?? 0,
      addressStreet: persistence.addressStreet ?? '',
      addressCity: persistence.addressCity ?? '',
      addressState: persistence.addressState ?? '',
      addressZipCode: persistence.addressZipCode ?? '',
      productsService: persistence.productsServices ?? [],
      websiteUrl: persistence.websiteUrl ?? '',
      contactEmail: persistence.contactEmail ?? '',
      contactPhone: persistence.contactPhone ?? '',
      vendorStatus: persistence.vendorStatus,
      rejectionReason: persistence.rejectionReason ?? undefined,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
      user: persistence.user
        ? {
            id: persistence.user.id,
            firstName: persistence.user.firstName,
            lastName: persistence.user.lastName,
            email: persistence.user.email,
          }
        : undefined,
    });
  }
}
