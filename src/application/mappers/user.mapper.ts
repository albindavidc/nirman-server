import { User } from '../../domain/entities/user.entity';
import { Vendor } from '../../domain/entities/vendor.entity';
import { VendorStatus } from '../../domain/enums/vendor-status.enum';
import { CreateUserDto } from '../dto/user/create-user.dto';

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
      CreateUserDto,
      'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password'
    >,
    role: Role,
  ): User {
    return new User({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      role: role,
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
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phoneNumber: entity.phoneNumber ?? undefined,
      isEmailVerified: entity.isEmailVerified ?? false,
      isPhoneVerified: entity.isPhoneVerified ?? false,
      dateOfBirth: entity.dateOfBirth ?? undefined,
      passwordHash: entity.passwordHash,
      profilePhotoUrl: entity.profilePhotoUrl ?? undefined,
      userStatus: entity.userStatus,
      role: entity.role,

      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),

      vendor: entity.vendor
        ? {
            id: entity.vendor.id,
            createdAt: entity.vendor.createdAt,
            updatedAt: entity.vendor.updatedAt,
            userId: entity.vendor.userId,
            companyName: entity.vendor.companyName,
            registrationNumber: entity.vendor.registrationNumber,
            taxNumber: entity.vendor.taxNumber ?? null,
            yearsInBusiness: entity.vendor.yearsInBusiness ?? null,
            addressStreet: entity.vendor.addressStreet ?? null,
            addressCity: entity.vendor.addressCity ?? null,
            addressState: entity.vendor.addressState ?? null,
            addressZipCode: entity.vendor.addressZipCode ?? null,
            productsServices: entity.vendor.productsService,
            websiteUrl: entity.vendor.websiteUrl ?? null,
            contactEmail: entity.vendor.contactEmail ?? null,
            contactPhone: entity.vendor.contactPhone ?? null,
            vendorStatus: entity.vendor.vendorStatus,
            rejectionReason: entity.vendor.rejectionReason ?? null,
            isDeleted: false,
            deletedAt: null,
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
      firstName: persistence.firstName,
      lastName: persistence.lastName,
      email: persistence.email,
      phoneNumber: persistence.phoneNumber ?? undefined,
      isEmailVerified: persistence.isEmailVerified,
      isPhoneVerified: persistence.isPhoneVerified,
      dateOfBirth: persistence.dateOfBirth ?? undefined,
      passwordHash: persistence.passwordHash,
      profilePhotoUrl: persistence.profilePhotoUrl ?? undefined,
      userStatus: persistence.userStatus,
      role: persistence.role,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
      vendor: persistence.vendor
        ? new Vendor({
            id: persistence.vendor.id,
            createdAt: persistence.vendor.createdAt,
            updatedAt: persistence.vendor.updatedAt,
            userId: persistence.vendor.userId,
            companyName: persistence.vendor.companyName,
            registrationNumber: persistence.vendor.registrationNumber,
            taxNumber: persistence.vendor.taxNumber ?? undefined,
            yearsInBusiness: persistence.vendor.yearsInBusiness ?? undefined,
            addressStreet: persistence.vendor.addressStreet ?? undefined,
            addressCity: persistence.vendor.addressCity ?? undefined,
            addressState: persistence.vendor.addressState ?? undefined,
            addressZipCode: persistence.vendor.addressZipCode ?? undefined,
            productsService: persistence.vendor.productsServices,
            websiteUrl: persistence.vendor.websiteUrl ?? undefined,
            contactEmail: persistence.vendor.contactEmail ?? undefined,
            contactPhone: persistence.vendor.contactPhone ?? undefined,
            vendorStatus: persistence.vendor
              .vendorStatus as unknown as VendorStatus,
            rejectionReason: persistence.vendor.rejectionReason ?? undefined,
          })
        : undefined,
    });
  }
}
