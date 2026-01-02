import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMembersQuery } from '../../../queries/member/get-members.query';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import {
  MemberResponseDto,
  MemberListResponseDto,
} from '../../../dto/member/member-response.dto';
import { Prisma } from '../../../../generated/client/client';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<GetMembersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetMembersQuery): Promise<MemberListResponseDto> {
    const { page, limit, role, search } = query;
    const skip = (page - 1) * limit;

    // Build where clause - only workers and supervisors are "members"
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

    const data: MemberResponseDto[] = users.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number ?? undefined,
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
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
