import { User } from '../../domain/entities/user.entity';
import { Vendor } from '../../domain/entities/vendor.entity';
import { VendorStatus } from '../../domain/enums/vendor-status.enum';
import { CreateVendorUserDto } from '../dto/vendor/create-vendor-user.dto';
import { Role } from '../../domain/enums/role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserPersistence } from '../interfaces/user.persistence.interface';

/**
 * Type-safe mapper for User entity <-> Application DTOs and standard Persistence DTOs.
 */
export class UserMapper {
  /**
   * Converts a persistence result to domain entity.
   */
  static fromPersistenceResult<T extends Record<string, unknown>>(
    result: T,
  ): User {
    return this.persistenceToEntity(result as unknown as UserPersistence);
  }

  /**
   * Converts a persistence result array to domain entities.
   */
  static fromPersistenceResults<T extends Record<string, unknown>>(
    results: T[],
  ): User[] {
    return results.map((r) => this.fromPersistenceResult(r));
  }

  /**
   * Converts domain entity to persistence create input format.
   */
  static toPersistenceCreateInput(data: User): Partial<UserPersistence> {
    return this.entityToPersistence(data);
  }

  /**
   * Converts domain entity to persistence update input format.
   */
  static toPersistenceUpdateInput(data: User): Partial<UserPersistence> {
    return this.entityToPersistence(data);
  }

  static dtoToEntity(
    dto: Pick<
      CreateVendorUserDto,
      'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password'
    >,
  ): User {
    return new User({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      role: Role.VENDOR,
      userStatus: UserStatus.ACTIVE,
    });
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
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phoneNumber: entity.phoneNumber,
      isEmailVerified: entity.isEmailVerified,
      isPhoneVerified: entity.isPhoneVerified,
      dateOfBirth: entity.dateOfBirth,
      profilePhotoUrl: entity.profilePhotoUrl,
      role: entity.role,
      userStatus: entity.userStatus,
      vendor: entity.vendor,
    };
  }

  static entityToPersistence(entity: User): Partial<UserPersistence> {
    const data: Partial<UserPersistence> = {
      first_name: entity.firstName,
      last_name: entity.lastName,
      email: entity.email,
      phone_number: entity.phoneNumber ?? undefined,
      is_email_verified: entity.isEmailVerified ?? false,
      is_phone_verified: entity.isPhoneVerified ?? false,
      date_of_birth: entity.dateOfBirth ?? undefined,
      password_hash: entity.passwordHash,
      profile_photo_url: entity.profilePhotoUrl ?? undefined,
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
            is_deleted: false,
            deleted_at: null,
          }
        : null,
    };

    if (entity.id) {
       data.id = entity.id;
    }

    return data;
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
      userStatus: persistence.user_status,
      role: persistence.role,
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
            vendorStatus: persistence.vendor
              .vendor_status as unknown as VendorStatus,
            rejectionReason: persistence.vendor.rejection_reason ?? undefined,
          })
        : undefined,
    });
  }
}
