import { Vendor } from 'src/domain/entities/vendor.entity';
import { CreateVendorCompanyDto } from '../dto/create-vendor-company.dto';
import { VendorStatus } from 'src/domain/enums/vendor-status.enum';

export class VendorMapper {
  static dtoToEntity(dto: CreateVendorCompanyDto): Partial<Vendor> {
    return {
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
    };
  }

  static entityToDto(entity: Vendor): CreateVendorCompanyDto {
    return {
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
}
