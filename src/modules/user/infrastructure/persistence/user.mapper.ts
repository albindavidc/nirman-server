import { User } from 'src/modules/user/domain/entities/user.entity';
import { Vendor } from 'src/modules/vendor/domain/entities/vendor.entity';
import { CreateVendorUserDto } from 'src/modules/vendor/application/dto/create-vendor-user.dto';
import { Role } from 'src/shared/domain/enums/role.enum';
import { UserPersistence } from 'src/modules/user/infrastructure/persistence/user.persistence';
import { UserStatus } from 'src/shared/domain/enums/user-status.enum';
import { VendorStatus } from 'src/modules/vendor/domain/enums/vendor-status.enum';

export class UserMapper {
  static dtoToEntity(
    dto: Pick<
      CreateVendorUserDto,
      'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password'
    >,
  ): Partial<User> {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      role: Role.VENDOR,
    };
  }

  static entityToDto(entity: User): {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    dateOfBirth?: Date;
    profilePhotoUrl?: string;
    role: Role;
    userStatus: UserStatus;
    vendor?: Vendor;
  } {
    const { passwordHash, ...dto } = entity;
    void passwordHash; // Intentionally excluded from response
    return dto;
  }

  static entityToPersistence(entity: Partial<User>): Partial<UserPersistence> {
    return {
      id: entity.id,

      first_name: entity.firstName,
      last_name: entity.lastName,
      email: entity.email,
      phone_number: entity.phoneNumber ?? null,
      is_email_verified: entity.isEmailVerified ?? false,
      is_phone_verified: entity.isPhoneVerified ?? false,
      date_of_birth: entity.dateOfBirth ?? null,
      password_hash: entity.passwordHash,
      profile_photo_url: entity.profilePhotoUrl ?? null,
      user_status: entity.userStatus,
      role: entity.role,

      created_at: entity.createdAt ?? new Date(),
      updated_at: entity.updatedAt ?? new Date(),

      vendor: entity.vendor
        ? {
            id: entity.vendor.id,
            created_at: entity.vendor.createdAt,
            updated_at: entity.vendor.updatedAt,
            user_id: entity.vendor.userId,
            company_name: entity.vendor.companyName,
            registration_number: entity.vendor.registrationNumber,
            tax_number: entity.vendor.taxNumber ?? null,
            years_in_business: entity.vendor.yearsInBusiness ?? null,
            address_street: entity.vendor.addressStreet ?? null,
            address_city: entity.vendor.addressCity ?? null,
            address_state: entity.vendor.addressState ?? null,
            address_zip_code: entity.vendor.addressZipCode ?? null,
            products_services: entity.vendor.productsService,
            website_url: entity.vendor.websiteUrl ?? null,
            contact_email: entity.vendor.contactEmail ?? null,
            contact_phone: entity.vendor.contactPhone ?? null,
            vendor_status: entity.vendor.vendorStatus,
            rejection_reason: entity.vendor.rejectionReason ?? null,
          }
        : null,
    };
  }

  static persistenceToEntity(persistence: UserPersistence): User {
    return new User({
      id: persistence.id,
      firstName: persistence.first_name,
      lastName: persistence.last_name,
      email: persistence.email,
      phoneNumber: persistence.phone_number ?? undefined,
      isEmailVerified: persistence.is_email_verified,
      isPhoneVerified: persistence.is_phone_verified,
      dateOfBirth: persistence.date_of_birth ?? undefined,
      passwordHash: persistence.password_hash,
      profilePhotoUrl: persistence.profile_photo_url ?? undefined,
      userStatus: persistence.user_status as UserStatus,
      role: persistence.role as Role,
      createdAt: persistence.created_at,
      updatedAt: persistence.updated_at,
      vendor: persistence.vendor
        ? new Vendor({
            id: persistence.vendor.id,
            createdAt: persistence.vendor.created_at,
            updatedAt: persistence.vendor.updated_at,
            userId: persistence.vendor.user_id,
            companyName: persistence.vendor.company_name,
            registrationNumber: persistence.vendor.registration_number,
            taxNumber: persistence.vendor.tax_number ?? undefined,
            yearsInBusiness: persistence.vendor.years_in_business ?? undefined,
            addressStreet: persistence.vendor.address_street ?? undefined,
            addressCity: persistence.vendor.address_city ?? undefined,
            addressState: persistence.vendor.address_state ?? undefined,
            addressZipCode: persistence.vendor.address_zip_code ?? undefined,
            productsService: persistence.vendor.products_services,
            websiteUrl: persistence.vendor.website_url ?? undefined,
            contactEmail: persistence.vendor.contact_email ?? undefined,
            contactPhone: persistence.vendor.contact_phone ?? undefined,
            vendorStatus: persistence.vendor.vendor_status as VendorStatus,
            rejectionReason:
              (persistence.vendor.rejection_reason as string | null) ??
              undefined,
          })
        : undefined,
    });
  }
}
