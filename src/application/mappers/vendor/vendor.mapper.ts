import { Vendor } from 'src/domain/entities/vendor.entity';
import { CreateVendorCompanyDto } from 'src/application/dto/vendor/create-vendor-company.dto';

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
      vendorStatus: dto.vendorStatus,
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
      user: null, // Logic for user expansion if needed
    };
  }
}
