import {
  WorkerWithProfessional,
  CreateWorkerData,
  UpdateWorkerData,
} from '../../domain/repositories/worker-repository.interface';
import {
  WorkerPersistence,
  WorkerWherePersistenceInput,
  WorkerCreatePersistenceInput,
  WorkerUpdatePersistenceInput,
} from '../../infrastructure/types/worker.types';
import { Role, Role as UserRole } from '../../domain/enums/role.enum';

export class WorkerMapper {
  /**
   * Converts a Prisma result to domain entity.
   */
  static fromPrismaResult<T extends Record<string, unknown>>(
    result: T,
  ): WorkerWithProfessional {
    return this.persistenceToEntity(result as unknown as WorkerPersistence);
  }

  /**
   * Converts a Prisma result array to domain entities.
   */
  static fromPrismaResults<T extends Record<string, unknown>>(
    results: T[],
  ): WorkerWithProfessional[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  /**
   * Converts create input to Prisma-compatible format.
   */
  static toPrismaCreateInput(
    data: CreateWorkerData,
  ): WorkerCreatePersistenceInput {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      passwordHash: data.passwordHash,
      role: data.role as UserRole,
      userStatus: 'active',
      professional: data.professional
        ? {
            create: {
              professionalTitle: data.professional.professionalTitle,
              experienceYears: data.professional.experienceYears ?? 0,
              skills: data.professional.skills ?? [],
              addressStreet: data.professional.addressStreet ?? '',
              addressCity: data.professional.addressCity ?? '',
              addressState: data.professional.addressState ?? '',
              addressZipCode: data.professional.addressZipCode ?? '',
            },
          }
        : undefined,
    };
  }

  /**
   * Converts update input to Prisma-compatible format.
   */
  static toPrismaUpdateInput(
    data: UpdateWorkerData,
  ): WorkerUpdatePersistenceInput {
    const updateData: WorkerUpdatePersistenceInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phoneNumber !== undefined)
      updateData.phoneNumber = data.phoneNumber;
    if (data.role !== undefined) updateData.role = data.role as UserRole;

    if (data.professional) {
      updateData.professional = {
        upsert: {
          create: {
            professionalTitle: data.professional.professionalTitle ?? '',
            experienceYears: data.professional.experienceYears ?? 0,
            skills: data.professional.skills ?? [],
            addressStreet: data.professional.addressStreet ?? '',
            addressCity: data.professional.addressCity ?? '',
            addressState: data.professional.addressState ?? '',
            addressZipCode: data.professional.addressZipCode ?? '',
          },
          update: {
            ...(data.professional.professionalTitle !== undefined && {
              professionalTitle: data.professional.professionalTitle,
            }),
            ...(data.professional.experienceYears !== undefined && {
              experienceYears: data.professional.experienceYears,
            }),
            ...(data.professional.skills !== undefined && {
              skills: data.professional.skills,
            }),
            ...(data.professional.addressStreet !== undefined && {
              addressStreet: data.professional.addressStreet,
            }),
            ...(data.professional.addressCity !== undefined && {
              addressCity: data.professional.addressCity,
            }),
            ...(data.professional.addressState !== undefined && {
              addressState: data.professional.addressState,
            }),
            ...(data.professional.addressZipCode !== undefined && {
              addressZipCode: data.professional.addressZipCode,
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
    input: WorkerWherePersistenceInput,
  ): WorkerWherePersistenceInput {
    const prismaWhere: WorkerWherePersistenceInput = {};

    if (input.role) {
      if (typeof input.role === 'object' && 'in' in input.role) {
        prismaWhere.role = { in: input.role.in };
        input.role = {
          in: (input.role as { in: Role[] }).in.map(this.mapRoleToUserRole),
        };
      } else {
        // Handle single Role.WORKER → UserRole.WORKER
        input.role = this.mapRoleToUserRole(input.role as Role);
      }
    }

    if (input.OR) {
      prismaWhere.OR = input.OR.map((condition) => ({ ...condition }));
    }

    return prismaWhere;
  }

  private static mapRoleToUserRole(role: Role): UserRole {
    const roleMap: Record<Role, UserRole> = {
      [Role.ADMIN]: UserRole.ADMIN,
      [Role.SUPERVISOR]: UserRole.SUPERVISOR,
      [Role.VENDOR]: UserRole.VENDOR,
      [Role.WORKER]: UserRole.WORKER,
    };
    const mapped = roleMap[role];
    if (!mapped) {
      throw new Error(`Unsupported role mapping: ${role}`); // Or handle gracefully
    }
    return mapped;
  }

  static persistenceToEntity(
    persistence: WorkerPersistence,
  ): WorkerWithProfessional {
    return {
      id: persistence.id,
      firstName: persistence.firstName,
      lastName: persistence.lastName,
      email: persistence.email,
      phoneNumber: persistence.phoneNumber,
      role: persistence.role,
      userStatus: persistence.userStatus,
      professional: persistence.professional
        ? {
            professionalTitle: persistence.professional?.professionalTitle,
            experienceYears: persistence.professional?.experienceYears,
            skills: persistence.professional?.skills,
            addressStreet: persistence.professional?.addressStreet,
            addressCity: persistence.professional?.addressCity,
            addressState: persistence.professional?.addressState,
            addressZipCode: persistence.professional?.addressZipCode,
          }
        : null,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    };
  }
}
