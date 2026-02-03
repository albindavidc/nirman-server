import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IMemberRepository,
  MemberWithProfessional,
  CreateMemberData,
  UpdateMemberData,
} from '../../../../domain/repositories/member-repository.interface';
import { Prisma, UserRole } from '../../../../generated/client/client';

type UserWithProfessional = Prisma.UserGetPayload<{
  include: { professional: true };
}>;

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToMemberWithProfessional(
    user: UserWithProfessional,
  ): MemberWithProfessional {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
      userStatus: user.user_status,
      professionalTitle: user.professional?.professional_title,
      experienceYears: user.professional?.experience_years,
      skills: user.professional?.skills,
      addressStreet: user.professional?.address_street,
      addressCity: user.professional?.address_city,
      addressState: user.professional?.address_state,
      addressZipCode: user.professional?.address_zip_code,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async findById(id: string): Promise<MemberWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { professional: true },
    });

    return user ? this.mapToMemberWithProfessional(user) : null;
  }

  async findByEmail(email: string): Promise<MemberWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { professional: true },
    });

    return user ? this.mapToMemberWithProfessional(user) : null;
  }

  async findAllWithFilters(params: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }): Promise<{ members: MemberWithProfessional[]; total: number }> {
    const { page, limit, role, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: { in: ['worker', 'supervisor'] },
    };

    if (role) {
      where.role = role as Prisma.EnumUserRoleFilter;
    }

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { professional: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      members: users.map((user) => this.mapToMemberWithProfessional(user)),
      total,
    };
  }

  async create(data: CreateMemberData): Promise<MemberWithProfessional> {
    const user = await this.prisma.user.create({
      data: {
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
      },
      include: { professional: true },
    });

    return this.mapToMemberWithProfessional(user);
  }

  async update(
    id: string,
    data: UpdateMemberData,
  ): Promise<MemberWithProfessional> {
    const updateData: Prisma.UserUpdateInput = {};

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

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { professional: true },
    });

    return this.mapToMemberWithProfessional(user);
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<MemberWithProfessional> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { user_status: status },
      include: { professional: true },
    });

    return this.mapToMemberWithProfessional(user);
  }
}
