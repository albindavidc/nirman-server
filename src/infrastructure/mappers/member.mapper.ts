import {
  MemberWithProfessional,
  CreateMemberData,
  UpdateMemberData,
} from 'src/domain/repositories/member-repository.interface';
import {
  MemberPersistence,
  MemberWherePersistenceInput,
  MemberCreatePersistenceInput,
  MemberUpdatePersistenceInput,
} from '../types/member.types';
import { Role as UserRole } from '../../domain/enums/role.enum';

/**
 * Type-safe mapper for Member entity <-> Prisma persistence conversion.
 */
export class MemberMapper {
  /**
   * Converts a Prisma result to domain entity.
   */
  static fromPrismaResult<T extends Record<string, unknown>>(
    result: T,
  ): MemberWithProfessional {
    return this.persistenceToEntity(result as unknown as MemberPersistence);
  }

  /**
   * Converts a Prisma result array to domain entities.
   */
  static fromPrismaResults<T extends Record<string, unknown>>(
    results: T[],
  ): MemberWithProfessional[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  /**
   * Converts create input to Prisma-compatible format.
   */
  static toPrismaCreateInput(
    data: CreateMemberData,
  ): MemberCreatePersistenceInput {
    return {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      password_hash: data.passwordHash,
      role: data.role as UserRole,
      user_status: 'active',
      professional: data.professional
        ? {
            create: {
              professional_title: data.professional.professionalTitle,
              experience_years: data.professional.experienceYears ?? 0,
              skills: data.professional.skills ?? [],
              address_street: data.professional.addressStreet ?? '',
              address_city: data.professional.addressCity ?? '',
              address_state: data.professional.addressState ?? '',
              address_zip_code: data.professional.addressZipCode ?? '',
            },
          }
        : undefined,
    };
  }

  /**
   * Converts update input to Prisma-compatible format.
   */
  static toPrismaUpdateInput(
    data: UpdateMemberData,
  ): MemberUpdatePersistenceInput {
    const updateData: MemberUpdatePersistenceInput = {};

    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.phoneNumber !== undefined)
      updateData.phone_number = data.phoneNumber;
    if (data.role !== undefined) updateData.role = data.role as UserRole;

    if (data.professional) {
      updateData.professional = {
        upsert: {
          create: {
            professional_title: data.professional.professionalTitle ?? '',
            experience_years: data.professional.experienceYears ?? 0,
            skills: data.professional.skills ?? [],
            address_street: data.professional.addressStreet ?? '',
            address_city: data.professional.addressCity ?? '',
            address_state: data.professional.addressState ?? '',
            address_zip_code: data.professional.addressZipCode ?? '',
          },
          update: {
            ...(data.professional.professionalTitle !== undefined && {
              professional_title: data.professional.professionalTitle,
            }),
            ...(data.professional.experienceYears !== undefined && {
              experience_years: data.professional.experienceYears,
            }),
            ...(data.professional.skills !== undefined && {
              skills: data.professional.skills,
            }),
            ...(data.professional.addressStreet !== undefined && {
              address_street: data.professional.addressStreet,
            }),
            ...(data.professional.addressCity !== undefined && {
              address_city: data.professional.addressCity,
            }),
            ...(data.professional.addressState !== undefined && {
              address_state: data.professional.addressState,
            }),
            ...(data.professional.addressZipCode !== undefined && {
              address_zip_code: data.professional.addressZipCode,
            }),
          },
        },
      };
    }

    return updateData;
  }

  /**
   * Converts where input to Prisma-compatible format.
   */
  static toPrismaWhereInput(
    where: MemberWherePersistenceInput,
  ): MemberWherePersistenceInput {
    const prismaWhere: MemberWherePersistenceInput = {};

    if (where.role) {
      if (typeof where.role === 'object' && 'in' in where.role) {
        prismaWhere.role = { in: where.role.in };
      } else {
        prismaWhere.role = where.role;
      }
    }

    if (where.OR) {
      prismaWhere.OR = where.OR.map((condition) => ({ ...condition }));
    }

    return prismaWhere;
  }

  static persistenceToEntity(
    persistence: MemberPersistence,
  ): MemberWithProfessional {
    return {
      id: persistence.id,
      firstName: persistence.first_name,
      lastName: persistence.last_name,
      email: persistence.email,
      phoneNumber: persistence.phone_number,
      role: persistence.role,
      userStatus: persistence.user_status,
      professionalTitle: persistence.professional?.professional_title,
      experienceYears: persistence.professional?.experience_years,
      skills: persistence.professional?.skills,
      addressStreet: persistence.professional?.address_street,
      addressCity: persistence.professional?.address_city,
      addressState: persistence.professional?.address_state,
      addressZipCode: persistence.professional?.address_zip_code,
      createdAt: persistence.created_at,
      updatedAt: persistence.updated_at,
    };
  }
}
