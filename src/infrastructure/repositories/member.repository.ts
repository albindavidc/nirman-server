import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/client/client';
import {
  IMemberRepository,
  MemberWithProfessional,
  CreateMemberData,
  UpdateMemberData,
} from '../../domain/repositories/member-repository.interface';
import { MemberWherePersistenceInput } from '../types/member.types';
import { MemberMapper } from '../mappers/member.mapper';
import { Role as UserRole } from '../../domain/enums/role.enum';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MemberWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { professional: true },
    });
    return user ? MemberMapper.fromPrismaResult(user) : null;
  }

  async findByEmail(email: string): Promise<MemberWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { professional: true },
    });
    return user ? MemberMapper.fromPrismaResult(user) : null;
  }

  async findAllWithFilters(params: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }): Promise<{ members: MemberWithProfessional[]; total: number }> {
    const { page, limit, role, search } = params;
    const skip = (page - 1) * limit;

    const where: MemberWherePersistenceInput = {
      role: { in: [UserRole.WORKER, UserRole.SUPERVISOR] },
    };

    if (role) {
      where.role = role as UserRole;
    }

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = MemberMapper.toPrismaWhereInput(where);

    const [members, total] = await Promise.all([
      this.prisma.user.findMany({
        where: prismaWhere as Prisma.UserWhereInput,
        skip,
        take: limit,
        include: { professional: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({
        where: prismaWhere as Prisma.UserWhereInput,
      }),
    ]);

    return {
      members: MemberMapper.fromPrismaResults(members),
      total,
    };
  }

  async create(data: CreateMemberData): Promise<MemberWithProfessional> {
    const prismaData = MemberMapper.toPrismaCreateInput(data);

    const created = await this.prisma.user.create({
      data: prismaData as Prisma.UserCreateInput,
      include: { professional: true },
    });

    return MemberMapper.fromPrismaResult(created);
  }

  async update(
    id: string,
    data: UpdateMemberData,
  ): Promise<MemberWithProfessional> {
    const prismaData = MemberMapper.toPrismaUpdateInput(data);

    await this.prisma.user.update({
      where: { id },

      data: prismaData as Prisma.UserUpdateInput,
    });

    return (await this.findById(id))!;
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

    return MemberMapper.fromPrismaResult(user);
  }
}
