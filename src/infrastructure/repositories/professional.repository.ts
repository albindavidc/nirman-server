import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/client/client';
import {
  IProfessionalRepository,
  ProfessionalWithUser,
} from '../../domain/repositories/professional-repository.interface';
import { ProfessionalWherePersistenceInput } from '../types/professional.types';

@Injectable()
export class ProfessionalRepository implements IProfessionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithFilters(params: {
    search?: string;
    excludeUserIds?: string[];
    limit?: number;
  }): Promise<ProfessionalWithUser[]> {
    const { search, excludeUserIds, limit = 50 } = params;

    // Build search filter
    const whereClause: ProfessionalWherePersistenceInput = {};

    if (search) {
      whereClause.OR = [
        { professionalTitle: { contains: search, mode: 'insensitive' } },
        {
          user: {
            is: { firstName: { contains: search, mode: 'insensitive' } },
          },
        },
        {
          user: {
            is: { lastName: { contains: search, mode: 'insensitive' } },
          },
        },
        { user: { is: { email: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (excludeUserIds && excludeUserIds.length > 0) {
      whereClause.userId = { notIn: excludeUserIds };
    }

    // Also filter to only active users that are not deleted
    whereClause.user = {
      is: {
        userStatus: 'active',
        isDeleted: false,
      },
    };

    const professionals = await this.prisma.professional.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            profilePhotoUrl: true,
          },
        },
      },
      take: limit,
    });

    type ProfessionalQueryResult = Prisma.ProfessionalGetPayload<{
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
            phoneNumber: true;
            profilePhotoUrl: true;
          };
        };
      };
    }>;

    return (professionals as ProfessionalQueryResult[]).map((p) => ({
      id: p.user.id,
      firstName: p.user.firstName,
      lastName: p.user.lastName,
      fullName: `${p.user.firstName} ${p.user.lastName}`,
      email: p.user.email,
      phone: p.user.phoneNumber,
      profilePhoto: p.user.profilePhotoUrl,
      title: p.professionalTitle,
      experienceYears: p.experienceYears,
      skills: p.skills,
    }));
  }

  async verifyProfessionals(userIds: string[]): Promise<string[]> {
    const professionals = await this.prisma.professional.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
      },
    });

    return professionals.map((p: { userId: string }) => p.userId);
  }
}
