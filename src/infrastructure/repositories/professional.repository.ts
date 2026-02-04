import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
        { professional_title: { contains: search, mode: 'insensitive' } },
        {
          user: {
            is: { first_name: { contains: search, mode: 'insensitive' } },
          },
        },
        {
          user: {
            is: { last_name: { contains: search, mode: 'insensitive' } },
          },
        },
        { user: { is: { email: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (excludeUserIds && excludeUserIds.length > 0) {
      whereClause.user_id = { notIn: excludeUserIds };
    }

    // Also filter to only active users that are not deleted
    whereClause.user = {
      is: {
        user_status: 'active',
        is_deleted: false,
      },
    };

    const professionals = await this.prisma.professional.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            profile_photo_url: true,
          },
        },
      },
      take: limit,
    });

    return professionals.map((p) => ({
      id: p.user.id,
      firstName: p.user.first_name,
      lastName: p.user.last_name,
      fullName: `${p.user.first_name} ${p.user.last_name}`,
      email: p.user.email,
      phone: p.user.phone_number,
      profilePhoto: p.user.profile_photo_url,
      title: p.professional_title,
      experienceYears: p.experience_years,
      skills: p.skills,
    }));
  }

  async verifyProfessionals(userIds: string[]): Promise<string[]> {
    const professionals = await this.prisma.professional.findMany({
      where: {
        user_id: { in: userIds },
      },
      select: {
        user_id: true,
      },
    });

    return professionals.map((p) => p.user_id);
  }
}
